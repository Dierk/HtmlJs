# install bun
curl -fsSL https://bun.sh/install | bash

# bundle

bundling comes as part of the build by default.
It can be suppressed via cli options.

example

                bun build ./outer.js --outfile=./code.js --watch

