// Cost calculation utilities for Raitu Bhoomi

export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '₹0';
  return `₹${parseFloat(amount).toLocaleString('en-IN')}`;
};

export const calculateTotalCost = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((total, item) => total + (item.cost || 0), 0);
};

export const calculateYieldAmount = (bags, pricePerBag) => {
  if (!bags || !pricePerBag) return 0;
  return bags * pricePerBag;
};

export const calculateTotalWeight = (bags, weightPerBag = 83) => {
  if (!bags) return 0;
  return bags * weightPerBag;
};

export const calculateProfitLoss = (totalInvestment, totalAmount) => {
  if (!totalInvestment || !totalAmount) return 0;
  return totalAmount - totalInvestment;
};

export const formatWeight = (kg) => {
  if (!kg && kg !== 0) return '0 kg';
  return `${parseFloat(kg).toFixed(2)} kg`;
};
