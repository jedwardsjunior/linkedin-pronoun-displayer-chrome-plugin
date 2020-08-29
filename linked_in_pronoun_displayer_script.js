const ACTOR_NAME_CLASS_NAME = 'feed-shared-actor__name';
const LINKED_IN_PRONOUN_DISPLAYER_NODE_ID = 'linked_in_pronoun_displayer_node';

const createPronounNode = (referenceNode, pronouns) => {
  // This is the referenceNode's sibling "description" span element
  const nodeToClone = referenceNode.parentNode.parentNode.children[1];
  pronounNode = nodeToClone.cloneNode(true);
  pronounNode.innerText = pronouns;
  pronounNode.id = LINKED_IN_PRONOUN_DISPLAYER_NODE_ID;
  nodeToClone.parentNode.insertBefore(pronounNode, nodeToClone);
}

const findNames = () => {
  const namesToSwitch = document.getElementsByClassName(ACTOR_NAME_CLASS_NAME);

  for (let i = 0; i < namesToSwitch.length; i++) {
    // This is the current "name" span element's (first) sibling "description" span element.
    const descriptionSiblingNode = namesToSwitch[i].parentNode.parentNode.children[1];
    // If this is a previously injected "pronoun" span element, it will have the pronoun displayer node ID 
    const alreadyProcessedThisName = descriptionSiblingNode.id === LINKED_IN_PRONOUN_DISPLAYER_NODE_ID;
    // Universities, businesses, groups, etc. all have their number of followers as their description,
    // whereas individuals typically (always?) have the person's title  
    const nameBelongsToAnOrganization = descriptionSiblingNode.innerText.includes("followers");
    
    if (alreadyProcessedThisName || nameBelongsToAnOrganization) {
      continue;
    }

    const nameElement = namesToSwitch[i].children[0];
    // Look for the pronoun suffix in the format "(subjective/objective/possessive)"
    // where the possessive case is optional. Case-insensitive search.
    // e.g. "(he/him)", "(they/them/theirs)", "(She/Her)", etc.
    const pronounSuffixRegex = /\([^()/]+\/[^()/]+\/*[^()/]*\)$/g;
    const originalName = nameElement.innerText;
    const pronounIndex = originalName.search(pronounSuffixRegex);

    if (pronounIndex > -1) {
      const name = originalName.substring(0, pronounIndex);
      const pronouns = originalName.substring(pronounIndex + 1, originalName.length - 1);
      nameElement.innerText = name;
      createPronounNode(namesToSwitch[i], `Pronouns: ${pronouns}`);
    } else {
      createPronounNode(namesToSwitch[i], 'Pronouns: not specified');
    }
  }
}

document.addEventListener("load", findNames());
window.onscroll = () => findNames();
