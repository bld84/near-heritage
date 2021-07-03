import { context, logging, storage, PersistentUnorderedMap, u128, ContractPromiseBatch } from "near-sdk-as";
import {AccountId, Balance, Amount, Timestamp} from "../../utils";
import {Contract, Staked} from './models';

/**************************/
/* STORAGE AND COLLECTIONS */
/**************************/

const CONTRACT = "Heritage";

/**************************/
/* PUBLIC METHODS */
/**************************/

export function initContract(owner : AccountId, lockedTime: Timestamp): void {
  assert(!storage.hasKey(CONTRACT), 'Already initialized');
  let contract = new Contract(owner, lockedTime);
  _saveContract(contract);
}

export function deleteContract(): void {
  _onlyOwner();
  storage.delete(CONTRACT);
}

export function depositFunds(account: AccountId): Balance{
  _isInit();

  // Check if the users have attached Nears to the transaction
  assert(context.attachedDeposit > u128.Zero, "Deposit should be bigger than 0");
  

  let amount: Amount = context.attachedDeposit;
  let contract: Contract = _getData();
  contract.storedTokens = u128.add(contract.storedTokens, amount);

  let depositor: Staked;

  // Let's check if we are already staking Nears for this account
  if (!contract.depositors.contains(account)){
    depositor = new Staked(account);
  }
  else {
    depositor = contract.depositors.getSome(account);
  }
   
  let storedTokens : Balance = depositor.deposit(amount);
  contract.depositors.set(account, depositor);
  _saveContract(contract);

  return storedTokens;
}

export function withdrawFunds(): Balance {
  _isInit();
  let contract: Contract = _getData();
  assert(contract.lockedTime < context.blockTimestamp, "This user cannot unlock the funding yet");
  assert(contract.depositors.contains(context.sender), "This user is not allowed to call this method" );

  let depositor: Staked = contract.depositors.getSome(context.sender);
  logging.log(depositor);
  let amount: Balance = depositor.storedTokens;

  // Remove balance
  contract.storedTokens = u128.sub(contract.storedTokens, amount);

  ContractPromiseBatch.create(context.sender).transfer(amount);
  contract.depositors.delete(context.sender);

  _saveContract(contract);

  return amount;
}

export function getDepositedFunds(): PersistentUnorderedMap<AccountId, Staked>{
  _isInit();
  let contract: Contract = _getData();
  return contract.depositors;
}

export function getTotalFunds(): Balance{
  let contract: Contract = _getData();
  return contract.storedTokens;
}

// /**************************/
// /* PRIVATE METHODS */
// /**************************/

function _saveContract(contract: Contract) : void {
  storage.set(CONTRACT, contract);
}

function _getData() : Contract {
  return storage.getSome<Contract>(CONTRACT);
}

function _isInit(): void {
  assert(storage.hasKey(CONTRACT), 'The contract should be initialized before usage.')
}

function _onlyOwner(): void{
  assert(context.sender == storage.getSome<Contract>(CONTRACT).owner, "Only the owner can call this method");
}
