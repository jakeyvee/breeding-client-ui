export type MountBreed = {
  "version": "0.1.0",
  "name": "mount_breed",
  "instructions": [
    {
      "name": "genesis",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMtm",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultAccountBump",
          "type": "u8"
        },
        {
          "name": "escrowAccountBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "cancel",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mountDataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mountMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mountTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "dataBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "redeem",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mountDataAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mountDataAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMountMintAccountA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userMountTokenAccountA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataMountA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userMountMintAccountB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userMountTokenAccountB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataMountB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userCustomTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMtmTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintMtm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initializerKey",
            "type": "publicKey"
          },
          {
            "name": "initializerDepositTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "mtmTokenMint",
            "type": "publicKey"
          },
          {
            "name": "whitelistCreatorA",
            "type": "publicKey"
          },
          {
            "name": "whitelistCreatorB",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "data",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};

export const IDL: MountBreed = {
  "version": "0.1.0",
  "name": "mount_breed",
  "instructions": [
    {
      "name": "genesis",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintMtm",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "creatorB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "vaultAccountBump",
          "type": "u8"
        },
        {
          "name": "escrowAccountBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "cancel",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerDepositTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mountDataAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mountMintAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mountTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "dataBump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "redeem",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mountDataAccountA",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mountDataAccountB",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMountMintAccountA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userMountTokenAccountA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataMountA",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userMountMintAccountB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userMountTokenAccountB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataMountB",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userCustomTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "userMtmTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "escrowAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "mintMtm",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vaultAuthority",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "escrowAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initializerKey",
            "type": "publicKey"
          },
          {
            "name": "initializerDepositTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "mtmTokenMint",
            "type": "publicKey"
          },
          {
            "name": "whitelistCreatorA",
            "type": "publicKey"
          },
          {
            "name": "whitelistCreatorB",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "data",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "count",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
