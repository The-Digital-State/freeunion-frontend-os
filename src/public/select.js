document.querySelectorAll('select').forEach((item) => {
  const formGroup = item.closest('.form-group__select'),
    selectOption = item.querySelectorAll('option'),
    selectOptionLength = selectOption.length,
    optionHeight = 38,
    optionPadding = 30,
    selectOptionHeight = selectOptionLength * optionHeight + optionPadding < 450 ? selectOptionLength * optionHeight + optionPadding : 450,
    selectOptionPx = selectOptionHeight - optionPadding,
    selectOptionLengthPx = selectOptionLength * optionHeight,
    sliderHeight = Math.round((selectOptionPx / selectOptionLengthPx) * selectOptionPx),
    sliderBottomPos = selectOptionPx - sliderHeight,
    maxScrollTop = selectOptionLengthPx - selectOptionPx - 10,
    selectedOption = item.querySelector('option:checked') ?? selectOption[0];

  item.style.display = 'none';

  const select = document.createElement('div');
  select.classList.add('select');
  select.innerText = selectedOption.innerText;
  formGroup.insertBefore(select, item);
  select.addEventListener('click', () => {
    if (formGroup.classList.contains('opened')) {
      formGroup.classList.remove('opened');
    } else {
      formGroup.classList.add('opened');
    }
  });

  const optionWrapper = document.createElement('div');
  optionWrapper.classList.add('select__options');
  optionWrapper.style.height = selectOptionHeight + 'px';
  formGroup.insertBefore(optionWrapper, item);

  const optionScroll = document.createElement('div');
  optionScroll.classList.add('select__scroll');
  optionWrapper.appendChild(optionScroll);

  selectOption.forEach((option) => {
    const optionElement = document.createElement('div');
    optionElement.classList.add('select__option');
    optionElement.innerText = option.innerText;
    optionScroll.appendChild(optionElement);
    optionElement.addEventListener('click', (event) => {
      optionWrapper.querySelector('.selected').classList.remove('selected');
      item.selectedIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
      optionWrapper.querySelectorAll('.select__option')[item.selectedIndex === -1 ? 0 : item.selectedIndex].classList.add('selected');
      select.innerText = event.target.innerText;
      select.click();
    });
  });
  optionWrapper.querySelectorAll('.select__option')[item.selectedIndex === -1 ? 0 : item.selectedIndex].classList.add('selected');

  if (sliderBottomPos > 0) {
    const optionScroller = document.createElement('div');
    optionScroller.classList.add('select__scroller');
    optionWrapper.appendChild(optionScroller);

    const optionScrollSlider = document.createElement('div');
    optionScrollSlider.classList.add('select__scroll-slider');
    optionScrollSlider.style.height = sliderHeight + 'px';
    optionScroller.appendChild(optionScrollSlider);

    optionScroll.addEventListener('scroll', () => {
      optionScrollSlider.style.top = (optionScroll.scrollTop / maxScrollTop) * sliderBottomPos + 'px';
    });
  }
});
