import {
  initContract,
  deleteContract,
  depositFunds,
  getDepositedFunds,
  getTotalFunds,
  withdrawFunds
} from "../assembly";
import { VMContext, u128 } from "near-sdk-as";

import {Staked} from '../assembly/models';
import { ZERO_NEAR, ONE_NEAR, TWO_NEAR, Timestamp } from "../../utils";


let contract: Staked;
let contract_name = "HeritageContract";
const alice = "alice";
const bob = "bob";
const lockedTimestamp: Timestamp = 1000000; // Unix Timestamp

beforeEach(() => {
  VMContext.setCurrent_account_id(contract_name);
  VMContext.setAccount_balance(ONE_NEAR); 
  VMContext.setSigner_account_id(alice);

  contract = new Staked(alice);

});

describe("Staked class", () => {

  it("should initialize correctly", () => {
      expect(contract).not.toBeNull();
  });

  it("owner should be set correctly", () => {
      expect(contract.account_id).toBe(alice);
  });

  it("balance should be initialized correctly", () => {
      expect(contract.storedTokens).toBe(u128.Zero);
  });
});


describe("Deposit funds", () => {

  beforeEach(() => {
    VMContext.setCurrent_account_id(contract_name);
    VMContext.setAccount_balance(ONE_NEAR); 
    VMContext.setSigner_account_id(alice);
    initContract(alice, lockedTimestamp);

  })

  it("Can't deposit less than 0 funds", () => {
    VMContext.setAttached_deposit(ZERO_NEAR);

      expect(() => {
          depositFunds(alice);
      }).toThrow();
  });

  it("Can deposit funds", () => {
    VMContext.setAttached_deposit(ONE_NEAR);
      expect(() => {
        depositFunds(alice)
      }).not.toThrow();
  });

  it("Can deposit funds and these funds are deposited", () => {
    VMContext.setAttached_deposit(ONE_NEAR);
    depositFunds(alice);
    const funds = getDepositedFunds();
    expect(funds.getSome(alice).account_id).toBe(alice);
  });

  it("Total fundings in the contract should be ONE NEAR", () => {
    VMContext.setAttached_deposit(ONE_NEAR);
    const storedFundings = depositFunds(alice);
    expect(storedFundings).toBe(ONE_NEAR);
  });

  it("Total fundings in the contract should be TWO NEAR", () => {
    VMContext.setAttached_deposit(ONE_NEAR);
    depositFunds(alice);

    VMContext.setAttached_deposit(ONE_NEAR);
    depositFunds(bob);

    const storedFundings = getTotalFunds();

    expect(storedFundings).toBe(TWO_NEAR);
  });

  it("Alice deposit should be ONE NEAR", () => {
    VMContext.setAttached_deposit(ONE_NEAR);
    depositFunds(alice);
    const funds = getDepositedFunds();
    expect(funds.getSome(alice).storedTokens).toBe(ONE_NEAR);
  });

  it("Alice deposit should be ONE NEAR and Bob deposit should be ONE NEAR and total funds should be TWO NEAR", () => {
    VMContext.setAttached_deposit(ONE_NEAR);
    depositFunds(alice);

    VMContext.setAttached_deposit(ONE_NEAR);
    depositFunds(bob);
    const funds = getDepositedFunds();
    expect(funds.getSome(alice).storedTokens).toBe(ONE_NEAR);
    expect(funds.getSome(bob).storedTokens).toBe(ONE_NEAR);

    const totalFunds = getTotalFunds();
    expect(totalFunds).toBe(TWO_NEAR);
  });
  afterEach(() => {
    deleteContract();
  })

  });
describe("WithDraw funds", () => {

  beforeEach(() => {
    VMContext.setCurrent_account_id(contract_name);
    VMContext.setSigner_account_id(alice);
    initContract(alice, lockedTimestamp);
    VMContext.setAttached_deposit(ONE_NEAR);
    depositFunds(alice);

  });
  
  it("Alice cannot withdraw funds during the locked time", () => {
    VMContext.setBlock_timestamp(0);
    expect(() => { 
      withdrawFunds();
    }).toThrow();
  });

  it("Alice can withdraw funds after the locked time", () => {
      VMContext.setBlock_timestamp(lockedTimestamp + 1); 
      const amount = withdrawFunds();
      expect(amount).toBe(ONE_NEAR);
  });

  it("Contract amount should be 0 NEAR after withdraw", () => {
    VMContext.setBlock_timestamp(lockedTimestamp + 1);
    expect(getTotalFunds()).toBe(ONE_NEAR); 
    
    const amount = withdrawFunds();
    expect(amount).toBe(ONE_NEAR);

    const totalFunds = getTotalFunds();
    expect(totalFunds).toBe(ZERO_NEAR);  
  });  

  it("Alice cannot withdraw funds two times", () => {
    VMContext.setBlock_timestamp(lockedTimestamp + 1); 
    withdrawFunds();
    expect(() => {
      withdrawFunds();
    }).toThrow();
  });

  it("Bob cannot withdraw funds", () => {
    VMContext.setBlock_timestamp(lockedTimestamp + 1); 
    VMContext.setSigner_account_id(bob);
    expect(() => {
      withdrawFunds();
    }).toThrow();
  });
});  

