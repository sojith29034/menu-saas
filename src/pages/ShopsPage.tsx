import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../contexts/ShopContext';
import { Pencil, Trash2 } from 'lucide-react';

function ShopsPage() {
  const { shops, loading, error, deleteShop } = useShop();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const handleDelete = async (shopId: string) => {
    if (window.confirm('Are you sure you want to delete this shop?')) {
      try {
        await deleteShop(shopId);
      } catch (err) {
        console.error('Failed to delete shop:', err);
        alert('Failed to delete shop. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shops</h1>
          <Link
            to="/admin/new"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Add New Shop
          </Link>
        </div>

        {shops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No shops found. Create your first shop!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={shop.imageUrl}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{shop.description}</p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/shop/${shop._id}`}
                      className="text-purple-600 hover:text-purple-700"
                    >
                      View Details
                    </Link>
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/edit/${shop._id}`}
                        className="p-2 text-blue-600 hover:text-blue-700"
                      >
                        <Pencil className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(shop._id)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ShopsPage;