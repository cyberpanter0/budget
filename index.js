import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Plus, Trash2, Edit3, Download, FileText, Sun, Moon, User, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const BudgetApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Eyüp Han Cam',
    email: 'eyuphan@example.com',
    budgetLimit: 10000,
    currency: 'TRY'
  });

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'income', amount: 5000, category: 'Maaş', description: 'Aylık maaş', date: '2025-06-01' },
    { id: 2, type: 'expense', amount: 1200, category: 'Market', description: 'Haftalık alışveriş', date: '2025-06-02' },
    { id: 3, type: 'expense', amount: 800, category: 'Ulaşım', description: 'Akbil yükleme', date: '2025-06-03' },
    { id: 4, type: 'income', amount: 2500, category: 'Freelance', description: 'Web tasarım projesi', date: '2025-06-04' },
    { id: 5, type: 'expense', amount: 450, category: 'Eğlence', description: 'Sinema ve yemek', date: '2025-06-05' },
    { id: 6, type: 'expense', amount: 1100, category: 'Faturalar', description: 'Elektrik + Su + İnternet', date: '2025-06-06' }
  ]);

  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = {
    income: ['Maaş', 'Freelance', 'Yatırım', 'Diğer'],
    expense: ['Market', 'Ulaşım', 'Faturalar', 'Eğlence', 'Sağlık', 'Giyim', 'Eğitim', 'Diğer']
  };

  // Hesaplamalar
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const currentBalance = totalIncome - totalExpense;
  const budgetUsagePercent = (totalExpense / currentUser.budgetLimit) * 100;

  // Grafik verileri
  const monthlyData = [
    { name: 'Ocak', income: 4500, expense: 3200 },
    { name: 'Şubat', income: 4800, expense: 3600 },
    { name: 'Mart', income: 5200, expense: 4100 },
    { name: 'Nisan', income: 4900, expense: 3800 },
    { name: 'Mayıs', income: 5100, expense: 4200 },
    { name: 'Haziran', income: totalIncome, expense: totalExpense }
  ];

  const categoryExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(categoryExpenses).map(([category, amount]) => ({
    name: category,
    value: amount,
    percentage: ((amount / totalExpense) * 100).toFixed(1)
  }));

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#14B8A6'];

  // Para birimi formatı
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: currentUser.currency
    }).format(amount);
  };

  // İşlem ekleme/düzenleme
  const handleSubmitTransaction = (e) => {
    e.preventDefault();
    const transaction = {
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      id: editingTransaction ? editingTransaction.id : Date.now()
    };

    if (editingTransaction) {
      setTransactions(prev => prev.map(t => t.id === editingTransaction.id ? transaction : t));
      setEditingTransaction(null);
    } else {
      setTransactions(prev => [...prev, transaction]);
    }

    setNewTransaction({
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowAddTransaction(false);
  };

  // İşlem silme
  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // İşlem düzenleme
  const editTransaction = (transaction) => {
    setNewTransaction(transaction);
    setEditingTransaction(transaction);
    setShowAddTransaction(true);
  };

  // CSV dışa aktarma
  const exportToCSV = () => {
    const headers = ['Tarih', 'Tür', 'Kategori', 'Açıklama', 'Tutar'];
    const rows = transactions.map(t => [
      t.date,
      t.type === 'income' ? 'Gelir' : 'Gider',
      t.category,
      t.description,
      t.amount
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'budget-transactions.csv';
    a.click();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <header className={`rounded-2xl shadow-lg p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Bütçe Yönetimi
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Hoş geldin, {currentUser.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={exportToCSV}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                <Download className="w-5 h-5" />
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <User className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </div>
            </div>
          </div>
        </header>

        {/* Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Toplam Gelir</p>
                <p className={`text-2xl font-bold text-green-500`}>{formatCurrency(totalIncome)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Toplam Gider</p>
                <p className={`text-2xl font-bold text-red-500`}>{formatCurrency(totalExpense)}</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Kalan Bakiye</p>
                <p className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(currentBalance)}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${currentBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <div className={`w-4 h-4 rounded-full ${currentBalance >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        <div className={`rounded-2xl shadow-lg p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Bütçe Kullanımı
            </h3>
            {budgetUsagePercent > 90 && (
              <div className="flex items-center text-red-500">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Bütçe limiti aşılıyor!</span>
              </div>
            )}
          </div>
          <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3`}>
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                budgetUsagePercent > 90 ? 'bg-red-500' : budgetUsagePercent > 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(budgetUsagePercent, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatCurrency(totalExpense)} / {formatCurrency(currentUser.budgetLimit)}
            </span>
            <span className={`text-sm font-medium ${budgetUsagePercent > 90 ? 'text-red-500' : darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              %{budgetUsagePercent.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Spending Chart */}
          <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Aylık Gelir/Gider Trendi
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="name" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    color: darkMode ? '#FFFFFF' : '#000000'
                  }}
                />
                <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={3} />
                <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Distribution */}
          <div className={`rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Kategori Dağılımı
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    color: darkMode ? '#FFFFFF' : '#000000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.name} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={`rounded-2xl shadow-lg p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Son İşlemler
            </h3>
            <button
              onClick={() => setShowAddTransaction(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni İşlem</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tarih</th>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Kategori</th>
                  <th className={`text-left py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Açıklama</th>
                  <th className={`text-right py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Tutar</th>
                  <th className={`text-right py-3 px-4 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice().reverse().map((transaction) => (
                  <tr key={transaction.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} hover:${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <td className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {new Date(transaction.date).toLocaleDateString('tr-TR')}
                    </td>
                    <td className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {transaction.category}
                    </td>
                    <td className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      {transaction.description}
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-medium ${
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => editTransaction(transaction)}
                          className={`p-1 rounded hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} transition-colors`}
                        >
                          <Edit3 className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        </button>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className={`p-1 rounded hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} transition-colors`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Transaction Modal */}
        {showAddTransaction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-xl p-6 w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingTransaction ? 'İşlem Düzenle' : 'Yeni İşlem Ekle'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    İşlem Türü
                  </label>
                  <select
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="expense">Gider</option>
                    <option value="income">Gelir</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Kategori
                  </label>
                  <select
                    value={newTransaction.category}
                    onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  >
                    <option value="">Kategori seçin</option>
                    {categories[newTransaction.type].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tutar (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Açıklama
                  </label>
                  <input
                    type="text"
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tarih
                  </label>
                  <input
                    type="date"
                    value={newTransaction.date}
                    onChange={(e) => setNewTransaction({...newTransaction, date: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={handleSubmitTransaction}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    {editingTransaction ? 'Güncelle' : 'Ekle'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddTransaction(false);
                      setEditingTransaction(null);
                      setNewTransaction({
                        type: 'expense',
                        amount: '',
                        category: '',
                        description: '',
                        date: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetApp;
