import inquirer from 'inquirer';
import AutocompletePrompt from 'inquirer-autocomplete-prompt';

declare module 'inquirer' {
  interface QuestionMap {
    autocomplete: AutocompletePrompt.AutocompleteQuestionOptions;
  }
}

export const setup = () => inquirer.registerPrompt('autocomplete', AutocompletePrompt);
