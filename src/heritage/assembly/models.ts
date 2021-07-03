
import {
    context,
    PersistentUnorderedMap,
    u128
} from "near-sdk-as";


import {AccountId, Balance, Amount, Timestamp} from "../../utils";

//To serialize the class
@nearBindgen
export class Contract {
    public owner: AccountId;
    public paused: bool = true;
    public storedTokens: Balance;
    public lockedTime: Timestamp;
    public depositors: PersistentUnorderedMap<AccountId, Staked> = new PersistentUnorderedMap<AccountId, Staked>("d");
  
  
    constructor(owner : AccountId, lockedTime: Timestamp) {
        this.storedTokens = u128.Zero;
        this.owner = owner;
        this.lockedTime = lockedTime;
    }
}

@nearBindgen
export class Staked {
    public storedTokens: Balance;
    public account_id: AccountId;

    constructor(
        account_id : AccountId,
    ) {
        this.storedTokens = u128.Zero;
        this.account_id = account_id;
    }
    @mutateState()
    deposit(amount: Amount): Balance{
        assert(context.attachedDeposit > u128.Zero, "Deposit should be bigger than 0");
        this.storedTokens = u128.add(this.storedTokens, amount);
        return this.storedTokens;
    }
}


