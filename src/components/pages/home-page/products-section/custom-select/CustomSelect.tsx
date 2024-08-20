import Select from 'react-select';
import './CustomSelec.sass';
import { FC } from 'react';

import { SingleValue } from 'react-select';

import { ISelectOptions } from '../../../../../interfaces/SelectOptions.interface';
import { SortParams } from '../../../../../interfaces/SortParams.interface';

interface CustomSelectProps {
  setSortParams: React.Dispatch<React.SetStateAction<SortParams>>;
}

const CustomSelect: FC<CustomSelectProps> = ({ setSortParams }) => {
  const handleChangeSelect = (
    selectValue: SingleValue<ISelectOptions>,
  ): void => {
    if (selectValue) {
      if (selectValue.value === 'title') {
        setSortParams({
          sortBy: 'title',
          order: 'asc',
        });
      } else if (selectValue.value === 'title-reverce') {
        setSortParams({
          sortBy: 'title',
          order: 'desc',
        });
      } else if (selectValue.value === 'price') {
        setSortParams({
          sortBy: 'price',
          order: 'asc',
        });
      } else if (selectValue.value === 'price-reverce') {
        setSortParams({
          sortBy: 'price',
          order: 'desc',
        });
      }
    }
  };

  const selectOptions: ISelectOptions[] = [
    { value: 'title', label: 'Nome' },
    { value: 'title-reverce', label: 'Nome reverso' },
    { value: 'price', label: 'Preço' },
    { value: 'price-reverce', label: 'Preço reverso' },
  ];

  return (
    <Select
      onChange={handleChangeSelect}
      isSearchable={false}
      className="custom-select"
      classNamePrefix="custom-select"
      defaultValue={selectOptions[0]}
      name="color"
      options={selectOptions}
    />
  );
};

export default CustomSelect;
