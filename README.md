# Vscode-magit

Magit-like git client for VSCode \
\
**DISCLAIMER**: This extension doesn't act exactly as Magit, but is inspired by it.

> For suggestions, bugs and issues go to [github repo](https://github.com/ToxyFlog1627/VSCodeMagit)

## Keybindings

`C-M` - open magit

`j` - down \
`k` - up \
`g` - jump to start \
`G` - jump to end \
`R` - refresh view \
`b` - manage remotes \
`c` - open commit message editor, press `c` again to submit \
`p` - push \
`P` - pull \
`r` - manage remotes \
`d` - to open diff of commit when it is selected \
`Escape` - abort/deselect \
`Enter` - toggle opened/closed groups \
`q` - quit view \
`s`/`u` - (un)stage change - hunk, part of hunk (see partial add), line \
`S`/`U` - (un)stage all unstaged changes

## Partial add

To add part of hunk you first need to select it by going to one end of desired chunk and pressing `Space` to start selection. \
Then, using movement keys, go to other side of the chunk and then press `s`/`u` depending on action to be performed
