Yarn 2 only supports those env variables:

- `npm_execpath`
- `npm_package_name`
- `npm_package_version`
- `npm_config_user_agent`
- `npm_node_execpath`
- `npm_lifecycle_event`

But they use to support many more when running scripts.

This plugin aims to add them.

# Supported env variables

## Fields in package.json

All fields (except [exceptions](#exceptions)) present in the package.json will be available, in a serialized way.

For instance, if you have this `package.json`:

```json
{
  "name": "hello",
  "version": "1.2.3",
  "keywords": ["roses", "are", "red"],
  "scripts": {
    "hello": "world"
  }
}
```

will generates those env vars:

```bash
npm_package_name=hello
npm_package_version=1.2.3
npm_package_keywords_0=roses
npm_package_keywords_1=are
npm_package_keywords_2=red
npm_package_scripts_hello=world
```

(note: all values will be converted to strings)

## Exceptions

### Global NPM vars

We don't want to get the default global NPM configs, So, we won't inject env like `npm_config_version_git_tag`, or `npm_config_version_tag_prefix`, or `npm_config_init_license` for instance.

### Runtime specific vars

In yarn 1, yarn was generating mappings and making them available as env vars. But we don't want to support those.

For instance if you were running `yarn hello`, yarn was injecting:

```bash
npm_config_argv='{"remain":[],"cooked":["run","hello"],"original":["hello"]}'
```

As we don't see the point of those, we decided to not supporting them.

### Complicated fields

In the package.json, some fields can be written in multiple ways.

For instance, you can write:

```json
{
  "author": "Ayc0 <ayc0.benj@gmail.com>",
  "author": {
    "name": "Ayc0",
    "email": "ayc0.benj@gmail.com"
  }
}
```

As we don't want to include _complex_ text parsers and keep this plugin as simple as possible, we won't support neither `author`, nor `contributors`, nor `repository` nor `funding` (different syntax but same idea).

### Vars based on files

In addition to having multiple string patterns in the package.json, the license could also be defined based on a LICENSE file present alongside the package.json.

As said before, we want to keep this plugin as simple as possible, so if we don't support string patterns, we won't check for files present on the disk.

So we won't support `npm_package_license` nor `npm_package_readmeFilename` (even if they are written in the package.json)

### Complete list

- `npm_config_version_git_tag`
- `npm_config_registry`
- `npm_config_python`
- `npm_config_ignore_scripts`
- `npm_config_ignore_optional`
- `npm_config_init_license`
- `npm_config_strict_ssl`
- `npm_config_save_prefix`
- `npm_config_user_agent`
- `npm_config_version_git_sign`
- `npm_node_execpath`
- `npm_execpath`
- `npm_config_email`
- `npm_config_username`
- `npm_config_version_git_message`
- `npm_config_version_tag_prefix`
- `npm_config_version_commit_hooks`
- `npm_config_bin_links`
- `npm_config_init_version`

---

- `npm_config_argv`

---

- `npm_package_repository_*`
- `npm_package_author_*`
- `npm_package_contributors_*`
- `npm_package_funding_*`

---

- `npm_package_readmeFilename`
- `npm_package_license`
