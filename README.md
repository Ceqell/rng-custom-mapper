# rng-custom-mapper
A lightweight, client-side tool to generate random number sequences and instantly map them to custom string outputs.

It runs entirely in your browser with no server dependencies; perfect for offline use.

Link: https://ceqell.github.io/rng-custom-mapper

## How it Works

You configure a set of **Source** inputs (identifiers) and **Output** targets. The generator picks a random Source ID and produces the corresponding Output target.

### Example

| Source | Output |
| :--- | :--- |
| 1 | A |
| 2 | B |
| 3 | C |
| 4 | D |
| 5 | E |

Generating a sequence of length 5, you might get: `A, C, C, E, B`.

## Features

* **Custom Mappings:** Add as many input/output pairs as needed.
* **Flexible Config:** Adjustable sequence length.
* **Visualizations:**
    * **Raw Sequence:** Copy-paste friendly text output.
    * **Grid View:** Visual representation of the generated items.
    * **Frequency Chart:** Real-time bar chart showing the distribution of your results.
* **Export:** One-click copy to clipboard functionality.

## Usage

1. Download the latest release and unzip.
2. Open `index.html` in any modern web browser.
3. Configure your mappings and click **Generate**.

Since this is a client-side tool, you can modify the source code directly to change default mappings or styling. rng-custom-mapper will never collect any data and send them anywhere; all data is processed locally on device.

## Technologies

* **Core:** Vanilla HTML, CSS, and JavaScript.
* **Icons:** [Lucide Icons](https://lucide.dev) (ISC License).

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
