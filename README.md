# CKEditor5 for phpBB

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

This is the repository for all CKEditor5 packages for phpBB.

## Development environment

This is monorepository for all CKEditor5 related packages used in phpBB, however,
many of these packages will be independently available via npm to ensure better
reusability. To achieve that, we use lerna to maintain this repository.

First, you will need some standard dependencies for JS development, namely nodeJS and npm.
We suggest you refer to the CKEditor5 [documentation](https://docs.ckeditor.com/ckeditor5/latest/builds/guides/development/custom-builds.html#requirements) 
and use the versions of these packages suggested there.

Next, you will need to install lerna.

```
npm install -g lerna
```

After these steps you are ready to clone your fork of this repository locally.
Then `cd` into your local folder and run 

```
lerna bootstrap --hoist
```

to install the project dependencies and link the packages in this repository.
