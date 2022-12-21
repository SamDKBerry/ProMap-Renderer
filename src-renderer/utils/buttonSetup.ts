export const setupActionButton = (id: string, type: string, listener: () => void) => {
  const actionButton = document.getElementById(id);
  if (actionButton) {
    actionButton.addEventListener(type, listener);
  } else {
    console.error(`Could not find action button with Id: ${id}`);
  }
};
