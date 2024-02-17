
# val.town Code Converter

val.town is a platform that allows users to write and share code snippets. However, the code on val.town is written in Deno which is not directly compatible with regular JavaScript. This utility aims to bridge that gap by converting val.town code into standard JavaScript.

## Usage

To use this utility, follow these steps:
1. Create a markdown JSON code block with the "package" information. You can refer to the example provided at [https://www.val.town/v/taras/scrape2md](https://www.val.town/v/taras/scrape2md).
   <img width="959" alt="image" src="https://github.com/tarasglek/valtown2js/assets/857083/36eda45a-a800-49d1-97c3-50a97c5eda0f">
   The json is used to configure the dnt export, see [dnt BuildOptions](https://deno.land/x/dnt@0.40.0/mod.ts?s=BuildOptions).
3. Run the utility using the following command:
   ```bash
   ./deno-export.ts https://www.val.town/v/taras/scrape2md
   ```

   This command will convert the val.town code into standard JavaScript and save the output in the `./npm` directory.

## Dependencies

This utility uses [https://github.com/denoland/dnt](https://github.com/denoland/dnt) to convert Deno code to JavaScript.
## Contributing

We welcome contributions to improve this utility. If you find any issues or have suggestions for enhancements, please feel free to open an issue or submit a pull request.
## License

This project is licensed under the [MIT License](LICENSE).
