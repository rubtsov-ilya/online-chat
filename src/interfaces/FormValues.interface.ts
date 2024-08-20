export interface IFormValues {
  phone: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  payment: 'Cartão de crédito' | 'Cartão de débito' | 'Dinheiro';
}
