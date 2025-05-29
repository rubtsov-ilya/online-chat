const usePluralizeMember = (array: any[]) => {
  const lastDigit = array.length % 10;
  const lastTwoDigits = array.length % 100;
  const membersText =
    lastTwoDigits >= 11 && lastTwoDigits <= 19
      ? 'участников'
      : lastDigit === 1
        ? 'участник'
        : lastDigit >= 2 && lastDigit <= 4
          ? 'участника'
          : 'участников';
  return `${array.length} ${membersText}`;
}

export default usePluralizeMember