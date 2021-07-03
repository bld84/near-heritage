# Sample

This repository includes a complete project structure for AssemblyScript contracts targeting the NEAR platform. This is an spicy "hello world" in assemblyscript for new developers.

The goal of this project is to have a smart contract where a user adds NEARs to the smart contract for a limit of time and having the restriction that only the selected wallet can unlock these NEARs.

The example here is very basic.  It's a simple contract demonstrating the following concepts:

- a single contract
- basic usage of timestamps
- basic contract storage
- basic usage of VMContext in the unit tests

The goal of this repository is to make it as easy as possible to get started writing unit and simulation tests for AssemblyScript contracts built to work with NEAR Protocol.

## Usage

### Getting started

1. clone this repo to a local folder
2. run `yarn`
3. run `yarn test`

### Top-level `yarn` commands

- run `yarn test` to run all tests
  - (!) be sure to run `yarn build:release` at least once before:
    - run `yarn test:unit` to run only unit tests
    - run `yarn test:simulate` to run only simulation tests
- run `yarn build` to quickly verify build status
- run `yarn clean` to clean up build folder

### Other documentation

- Sample contract and test documentation
  - see `/src/heritage/README` for contract interface
  - see `/src/heritage/__tests__/README` for Sample unit testing details

- Sample contract simulation tests
  - see `/simulation/README` for simulation testing


## The file system

Please note that boilerplate project configuration files have been ommitted from the following lists for simplicity.

### Contracts and Unit Tests

```txt
src
├── heritage                        <-- heritage contract
│   ├── README.md
│   ├── __tests__
│   │   ├── README.md
│   │   └── index.unit.spec.ts
│   └── assembly
│       ├── index.ts
│       └── models.ts
└── utils.ts                      <-- shared contract code
```

### Helper Scripts

```txt
scripts
├── 1.init.sh
├── 2.run.sh
└── README.md                     <-- instructions
```
