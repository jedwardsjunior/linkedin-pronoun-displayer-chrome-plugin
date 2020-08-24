const linkedInPronounDisplayerNodeId = 'linked_in_pronoun_displayer_node';

const createPronounNode = (referenceNode, pronouns) => {
  const nodeToClone = referenceNode.parentNode.parentNode.children[1];
  pronounNode = nodeToClone.cloneNode(true);
  pronounNode.innerText = pronouns;
  pronounNode.id = linkedInPronounDisplayerNodeId;
  nodeToClone.parentNode.insertBefore(pronounNode, nodeToClone);
}

const findNames = () => {
  const actorNameClassName = 'feed-shared-actor__name';
  const namesToSwitch = document.getElementsByClassName(actorNameClassName);

  for (let i = 0; i < namesToSwitch.length; i++) {
    const alreadyProcessedThisName = namesToSwitch[i].parentNode.parentNode.children[1].id === linkedInPronounDisplayerNodeId
    if (alreadyProcessedThisName) {
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
