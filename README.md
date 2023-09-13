# regex-engine

A (work-in-progress) DFA-driven regular expression engine. As a starting point, the engine's parser will support all regular expressions that can be generated using this grammar:

```
regex -> expr* ;
expr -> alt_expr ;
alt_expr -> (concat_expr "|" concat_expr) | concat_expr ;
concat_expr -> kleene_expr+ ;
kleene_expr -> paren_expr "*" | paren_expr ;
paren_expr -> "(" expr+ ")" | char_expr ;
char_expr -> [a-z] | [A-Z] | [0-9] ;
```