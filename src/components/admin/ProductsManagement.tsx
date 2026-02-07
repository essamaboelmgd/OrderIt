
import { useState, useMemo } from 'react';
import { Plus, Pencil, Trash2, Search, Upload, Image as ImageIcon, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/contexts/AdminContext';
import { Product, Category } from '@/types/restaurant';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ITEMS_PER_PAGE = 10;

export default function ProductsManagement() {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory } = useAdmin();

  // Product State
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productFormData, setProductFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    image: '',
    categoryId: '',
    isAvailable: true,
    preparationTime: '',
  });

  // Category State
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    nameAr: '',
    order: '',
  });

  // Product Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetProductForm = () => {
    setProductFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      price: '',
      image: '',
      categoryId: '',
      isAvailable: true,
      preparationTime: '',
    });
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      nameAr: product.nameAr,
      description: product.description,
      descriptionAr: product.descriptionAr,
      price: product.price.toString(),
      image: product.image,
      categoryId: product.categoryId,
      isAvailable: product.isAvailable,
      preparationTime: product.preparationTime.toString(),
    });
    setIsProductDialogOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: productFormData.nameAr, // Use Arabic name for English field
      nameAr: productFormData.nameAr,
      description: productFormData.descriptionAr, // Use Arabic description for English field
      descriptionAr: productFormData.descriptionAr,
      price: parseFloat(productFormData.price),
      image: productFormData.image || '/placeholder.svg',
      categoryId: productFormData.categoryId,
      isAvailable: productFormData.isAvailable,
      preparationTime: parseInt(productFormData.preparationTime),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    setIsProductDialogOpen(false);
    resetProductForm();
  };

  // Category Logic
  const resetCategoryForm = () => {
    setCategoryFormData({ name: '', nameAr: '', order: '' });
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      nameAr: category.nameAr,
      order: category.order.toString(),
    });
    setIsCategoryDialogOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData = {
      name: categoryFormData.nameAr, // Use Arabic name for English field
      nameAr: categoryFormData.nameAr,
      image: '', // Removed image support for categories
      order: parseInt(categoryFormData.order) || categories.length + 1,
    };

    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }

    setIsCategoryDialogOpen(false);
    resetCategoryForm();
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.nameAr || 'غير محدد';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="products" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="products">المنتجات ({products.length})</TabsTrigger>
            <TabsTrigger value="categories">التصنيفات ({categories.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="products" className="space-y-4">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-9"
              />
            </div>
            <Button onClick={() => { resetProductForm(); setIsProductDialogOpen(true); }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة منتج
            </Button>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">إجراءات</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>التصنيف</TableHead>
                  <TableHead>الاسم</TableHead>
                  <TableHead className="w-[80px]">صورة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.isAvailable ? 'متوفر' : 'غير متوفر'}
                      </span>
                    </TableCell>
                    <TableCell>{product.price} ج</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs bg-muted w-fit px-2 py-1 rounded-full text-muted-foreground">
                        <Tag className="h-3 w-3" />
                        {getCategoryName(product.categoryId)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.nameAr}</TableCell>
                    <TableCell>
                      <div className="h-10 w-10 rounded-lg overflow-hidden bg-muted">
                        <img src={product.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                السابق
              </Button>
              <span className="flex items-center px-4 text-sm font-medium">
                صفحة {currentPage} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                التالي
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-end mb-4">
            <Button onClick={() => { resetCategoryForm(); setIsCategoryDialogOpen(true); }}>
              <Plus className="h-4 w-4 ml-2" />
              إضافة تصنيف
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{category.nameAr}</h3>
                  <p className="text-sm text-muted-foreground">{categories.findIndex(c => c.id === category.id) + 1}#</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deleteCategory(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">اسم المنتج</label>
              <Input
                value={productFormData.nameAr}
                onChange={(e) => setProductFormData({ ...productFormData, nameAr: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">الوصف</label>
              <Textarea
                value={productFormData.descriptionAr}
                onChange={(e) => setProductFormData({ ...productFormData, descriptionAr: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">السعر (جنية)</label>
                <Input
                  type="number"
                  value={productFormData.price}
                  onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">وقت التحضير (دقيقة)</label>
                <Input
                  type="number"
                  value={productFormData.preparationTime}
                  onChange={(e) => setProductFormData({ ...productFormData, preparationTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">التصنيف</label>
              <Select
                value={productFormData.categoryId}
                onValueChange={(value) => setProductFormData({ ...productFormData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.nameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">صورة المنتج</label>
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted">
                  {productFormData.image ? (
                    <img src={productFormData.image} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">اختر صورة من جهازك</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
              <label className="text-sm font-medium">متاح للطلب</label>
              <Switch
                checked={productFormData.isAvailable}
                onCheckedChange={(checked) => setProductFormData({ ...productFormData, isAvailable: checked })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsProductDialogOpen(false)}>
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">اسم التصنيف</label>
              <Input
                value={categoryFormData.nameAr}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, nameAr: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">الترتيب</label>
              <Input
                type="number"
                value={categoryFormData.order}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, order: e.target.value })}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1">
                {editingCategory ? 'حفظ التعديلات' : 'إضافة التصنيف'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
