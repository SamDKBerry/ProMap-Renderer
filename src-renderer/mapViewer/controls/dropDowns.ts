export const setupDropdowns = () => {
  window.onclick = function (event) {
    const element = event.target as HTMLInputElement;
    if (!element.matches('.toggle-button')) {
      closeDropdown();
    }
  };
  const slidersDropdown = document.getElementById('backgroundSlidersDropdownContent');
  if (slidersDropdown) {
    slidersDropdown.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }

  const colorDropdown = document.getElementById('mapBackgroundColor');
  if (colorDropdown) {
    colorDropdown.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  }
};

export const closeDropdown = () => {
  const dropdowns = document.getElementsByClassName('dropdown-content');
  let i;
  for (i = 0; i < dropdowns.length; i++) {
    const openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
};
