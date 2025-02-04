# diskhog

**diskhog** is a Node.js program designed to analyze disk usage and display file and directory statistics in various formats. It supports sorting, size thresholds, and localization options for user convenience.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js** (v12 or higher recommended)
- **npm** (comes with Node.js)

Installation

1. Clone or download the repository.

2. Navigate to the project directory.

3. Run the following command to install the necessary dependencies:

  ```bash
  npm install
  ```

## Usage

Run the program using the following command:

| Argument | Description | Default |
| ----------- | ----------- | ----------- |
| -p, --path | The relative or absolute path name of a file or directory. | . |
| -s, --sort | Sorting options: | Unsorted |
| | - alpha: Sort alphabetically (ascending) | |
| | - exten: Sort by file extension alphabetically (ascending) | |
| | - size: Sort by size (descending) | |
| | You can specify two sort orders, where the second is used as a secondary sort, e.g., -s exten size. | |
| -m, --metric | Displays file sizes as KB, MB, GB, and TB. | None |
| -t, --threshold |  | 0 |
| -lang, --language | Changes the help text and number format when showing file sizes. Provide a 2-letter language code and 2-letter country code (e.g., en-US). Defaults to the environment variable LANG, or en-US if not set. | Environment variable LANG, or en-US |
| -h, --help | Prints the usage screen, respecting the --language option if set. | N/A |




### Example Commands

1. Analyze the current directory and sort files by size:

```bash
node diskhog -s size
```

2. Analyze a specific directory and sort by extension, then alphabetically within extensions:

```bash
node diskhog -p ./my-directory -s exten alpha
```

3. Display files larger than 10 MB in metric units:

```bash
node diskhog -t 10 -m
```

4. Show help in French (France):

```bash
node diskhog -h --language fr-FR
```

Notes

- All unrecognized parameters are ignored.
- Ensure proper file system permissions for the provided directory or file path.