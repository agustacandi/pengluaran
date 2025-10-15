'use client'

import { useState } from 'react'
import { Category, TransactionType } from '@/lib/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { CategoryModal } from './CategoryModal'
import { createClient } from '@/lib/supabase/client'
import * as Icons from 'lucide-react'

interface CategoriesContentProps {
  categories: Category[]
}

export function CategoriesContent({ categories: initialCategories }: CategoriesContentProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const supabase = createClient()

  const handleAddCategory = () => {
    setEditingCategory(undefined)
    setIsModalOpen(true)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setIsModalOpen(true)
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kategori ini? Transaksi terkait tidak akan terhapus.')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error

      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (error: any) {
      alert('Error: ' + error.message)
    }
  }

  const handleCategorySaved = (savedCategory: Category) => {
    if (editingCategory) {
      setCategories(prev =>
        prev.map(c => c.id === savedCategory.id ? savedCategory : c)
      )
    } else {
      setCategories(prev => [...prev, savedCategory])
    }
    setIsModalOpen(false)
    setEditingCategory(undefined)
  }

  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  const getIcon = (iconName?: string) => {
    if (!iconName) return null
    const Icon = (Icons as any)[iconName]
    if (!Icon) return null
    return <Icon className="w-5 h-5" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kategori</h1>
          <p className="text-gray-600 mt-1">Kelola kategori transaksi Anda</p>
        </div>
        <Button onClick={handleAddCategory}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 mb-1">Kategori Pemasukan</p>
              <p className="text-3xl font-bold text-green-700">{incomeCategories.length}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600 opacity-50" />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Kategori Pengeluaran</p>
              <p className="text-3xl font-bold text-red-700">{expenseCategories.length}</p>
            </div>
            <TrendingDown className="w-10 h-10 text-red-600 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Income Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-700">Kategori Pemasukan</CardTitle>
        </CardHeader>
        <CardContent>
          {incomeCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {incomeCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative group p-4 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      {getIcon(category.icon)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">Pemasukan</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCategory(category)}
                      className="flex-1"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Belum ada kategori pemasukan
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-700">Kategori Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          {expenseCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {expenseCategories.map((category) => (
                <div
                  key={category.id}
                  className="relative group p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color + '20', color: category.color }}
                    >
                      {getIcon(category.icon)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{category.name}</p>
                      <p className="text-xs text-gray-500">Pengeluaran</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditCategory(category)}
                      className="flex-1"
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="flex-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Belum ada kategori pengeluaran
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingCategory(undefined)
        }}
        category={editingCategory}
        onSuccess={handleCategorySaved}
      />
    </div>
  )
}
