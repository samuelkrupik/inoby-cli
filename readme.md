# Inoby CLI

Code generator cli

## Installation

Install using npm or yarn as global package.

```sh
npm install inoby-cli -g
```

or

```sh
yarn global add inoby-cli
```

Now CLI is globally installed. You can access it by typing `inoby` to terminal

## Usage

```sh
inoby <cmd> [args]
```

## Commands

You can view all commands with `--help` options

### Generate page template

```sh
inoby make:template <page-template> <template-name>
```

**Arguments**

- `<page-template>` Name of the page template in dash-case (e.g. home-page)
- `<template-name>` Template name (e.g. "Home page")

**Options**

- `--help` Show help
- `--out, -o` Output directory
- `--require, -r` Require in index.php

### Generate post type

```sh
inoby make:post-type <post-type> <name>
```

**Arguments**

- `<post-type>` Name of the post type to register in dash-case (e.g. post-type)
- `<name>` Name of the post type to display (e.g. Post type)

**Options**

- `--help` Show help
- `--out, -o` Output directory
- `--require, -r` Require in index.php
- `--metaboxes, -m` Generate metaboxes.php

### Generate component

```sh
inoby make:component <component> <name>
```

**Arguments**

- `<component>` Name of the component in dash-case (e.g. product-slider)
- `<name>` Name of the component (e.g. "Produktový slider")

**Options**

- `--help` Show help
- `--out, -o` Output directory
- `--require, -r` Require in index.php
- `--webpack, -w` Require in webpack.entry.js
- `--all, -a` Require in index.php and webpack.entry.js
