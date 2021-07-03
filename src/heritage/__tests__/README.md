## Unit tests

Unit tests can be run from the top level folder using the following command:

```
yarn test:unit
```

### Tests for Contract in `index.unit.spec.ts`


```
[Describe]: Staked class

 [Success]: ✔ should initialize correctly
 [Success]: ✔ owner should be set correctly
 [Success]: ✔ balance should be initialized correctly

[Describe]: Deposit funds

 [Success]: ✔ Can't deposit less than 0 funds
 [Success]: ✔ Can deposit funds
 [Success]: ✔ Can deposit funds and these funds are deposited
 [Success]: ✔ Total fundings in the contract should be ONE NEAR
 [Success]: ✔ Total fundings in the contract should be TWO NEAR
 [Success]: ✔ Alice deposit should be ONE NEAR
 [Success]: ✔ Alice deposit should be ONE NEAR and Bob deposit should be ONE NEAR and total funds should be TWO NEAR

[Describe]: WithDraw funds

 [Success]: ✔ Alice cannot withdraw funds during the locked time
 [Success]: ✔ Alice can withdraw funds after the locked time
 [Success]: ✔ Contract amount should be 0 NEAR after withdraw
 [Success]: ✔ Alice cannot withdraw funds two times
 [Success]: ✔ Bob cannot withdraw funds

    [File]: src/heritage/__tests__/index.unit.spec.ts
  [Groups]: 4 pass, 4 total
  [Result]: ✔ PASS
[Snapshot]: 0 total, 0 added, 0 removed, 0 different
 [Summary]: 15 pass,  0 fail, 15 total
    [Time]: 223.96ms

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  [Result]: ✔ PASS
   [Files]: 1 total
  [Groups]: 4 count, 4 pass
   [Tests]: 15 pass, 0 fail, 15 total
    [Time]: 16122.843ms
```
