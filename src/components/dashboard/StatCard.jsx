const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
        <Icon size={24} />
      </div>
    </div>
  </div>
);