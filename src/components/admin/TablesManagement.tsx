import { useState } from 'react';
import { Plus, Trash2, QrCode, Printer, ExternalLink, Receipt } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/contexts/AdminContext';
import { useOrders } from '@/contexts/OrderContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function TablesManagement() {
  const { tables, addTable, deleteTable, toggleTableStatus } = useAdmin();
  const { getOrdersByTable, completeTableOrders } = useOrders();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<{ number: number; qrCode: string } | null>(null);
  const [checkoutTable, setCheckoutTable] = useState<number | null>(null);
  const [newTableNumber, setNewTableNumber] = useState('');

  const baseUrl = window.location.origin;

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    const tableNum = parseInt(newTableNumber);
    if (tableNum && !tables.find((t) => t.number === tableNum)) {
      addTable(tableNum);
      setNewTableNumber('');
      setIsDialogOpen(false);
    }
  };

  const handlePrintQR = (tableNumber: number) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>QR Code - طاولة ${tableNumber}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: 'Tajawal', Arial, sans-serif;
              background: #f5f5f5;
            }
            .card {
              background: white;
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 10px 40px rgba(0,0,0,0.1);
              text-align: center;
            }
            h1 { color: #d97706; margin: 0 0 10px; }
            h2 { color: #1f2937; margin: 0 0 30px; font-size: 48px; }
            p { color: #6b7280; margin-top: 20px; }
            .qr { padding: 20px; background: white; border-radius: 10px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>OrderIt</h1>
            <h2>طاولة رقم ${tableNumber}</h2>
            <div class="qr">
              <img src="${document.getElementById(`qr-${tableNumber}`)?.querySelector('svg')?.outerHTML
          ? `data:image/svg+xml,${encodeURIComponent(document.getElementById(`qr-${tableNumber}`)?.querySelector('svg')?.outerHTML || '')}`
          : ''}" width="200" height="200" />
            </div>
            <p>امسح الكود للطلب</p>
          </div>
          <script>
            setTimeout(() => window.print(), 500);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleViewQR = (table: { number: number; qrCode: string }) => {
    setSelectedTable(table);
  };

  const handleCheckoutClick = (tableNumber: number) => {
    setCheckoutTable(tableNumber);
  };

  const getTableTotal = (tableNumber: number) => {
    const orders = getOrdersByTable(tableNumber).filter(o => o.status !== 'completed');
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  };

  const confirmCheckout = () => {
    if (!checkoutTable) return;

    // Print Invoice
    const tableOrders = getOrdersByTable(checkoutTable).filter(o => o.status !== 'completed');
    if (tableOrders.length === 0) {
      // Just close if no orders
      setCheckoutTable(null);
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const total = tableOrders.reduce((sum, o) => sum + o.totalAmount, 0);
      const date = new Date().toLocaleString('ar-SA');

      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>فاتورة طاولة ${checkoutTable}</title>
          <style>
            body { font-family: 'Tajawal', Arial, sans-serif; padding: 20px; max-width: 300px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 10px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 14px; }
            .total { border-top: 2px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; font-size: 18px; display: flex; justify-content: space-between; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>OrderIt</h2>
            <p>فاتورة طاولة ${checkoutTable}</p>
            <p>${date}</p>
          </div>
          <div>
            ${tableOrders.map(order =>
        order.items.map(item => `
                    <div class="item">
                        <span>${item.product.nameAr} x${item.quantity}</span>
                        <span>${item.product.price * item.quantity}</span>
                    </div>
                `).join('')
      ).join('')}
          </div>
          <div class="total">
            <span>الإجمالي</span>
            <span>${total} جنية</span>
          </div>
          <div class="footer">
            <p>شكراً لزيارتكم</p>
          </div>
          <script>
            setTimeout(() => { window.print(); window.close(); }, 500);
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }

    // Complete Orders & Reset Table
    completeTableOrders(checkoutTable);
    const table = tables.find(t => t.number === checkoutTable);
    if (table && table.isActive) {
      toggleTableStatus(table.id); // Set to inactive/free if desired, or just complete orders. User said "Reset", implies freeing up.
    }
    setCheckoutTable(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {tables.filter((t) => t.isActive).length} طاولة نشطة من أصل {tables.length}
        </p>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          إضافة طاولة
        </Button>
      </div>

      {/* Tables Grid */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {tables.map((table) => {
          const currentTotal = getTableTotal(table.number);
          const hasOrders = currentTotal > 0;

          return (
            <div
              key={table.id}
              className={`bg-card rounded-xl p-5 shadow-card transition-all relative overflow-hidden ${!table.isActive ? 'opacity-70' : ''
                }`}
            >
              {hasOrders && <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-bl-xl shadow-sm animate-pulse" />}

              <div className="flex items-center justify-between mb-4">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{table.number}</span>
                </div>
                <Switch
                  checked={table.isActive}
                  onCheckedChange={() => toggleTableStatus(table.id)}
                />
              </div>

              <h3 className="font-bold text-foreground mb-1">طاولة رقم {table.number}</h3>
              <div className="flex justify-between items-center mb-4">
                <p className={`text-sm ${table.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {table.isActive ? 'مفتوحة' : 'مغلقة'}
                </p>
                {hasOrders && <span className="text-sm font-bold text-primary">{currentTotal} ج</span>}
              </div>

              {/* QR Code Preview (Hidden) */}
              <div id={`qr-${table.number}`} className="hidden">
                <QRCodeSVG value={`${baseUrl}${table.qrCode}`} size={200} level="H" includeMargin />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleViewQR(table)}
                >
                  <QrCode className="h-4 w-4" />
                </Button>
                <Button
                  variant={hasOrders ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={() => handleCheckoutClick(table.number)}
                >
                  <Receipt className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add Table Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>إضافة طاولة جديدة</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTable} className="space-y-4">
            <div>
              <label className="text-sm font-medium">رقم الطاولة</label>
              <Input
                type="number"
                value={newTableNumber}
                onChange={(e) => setNewTableNumber(e.target.value)}
                min="1"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                إضافة
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                إلغاء
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View QR Dialog */}
      <Dialog open={!!selectedTable} onOpenChange={() => setSelectedTable(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>رمز QR - طاولة {selectedTable?.number}</DialogTitle>
          </DialogHeader>
          {selectedTable && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 flex items-center justify-center">
                <QRCodeSVG
                  value={`${baseUrl}${selectedTable.qrCode}`}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
              <p className="text-center text-sm text-muted-foreground break-all">
                {baseUrl}{selectedTable.qrCode}
              </p>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => handlePrintQR(selectedTable.number)}
                >
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`${baseUrl}${selectedTable.qrCode}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Checkout Dialog */}
      <Dialog open={!!checkoutTable} onOpenChange={() => setCheckoutTable(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>إغلاق حساب الطاولة {checkoutTable}</DialogTitle>
          </DialogHeader>
          {checkoutTable && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-xl">
                <div className="flex justify-between font-bold text-lg mb-2">
                  <span>الإجمالي المستحق</span>
                  <span>{getTableTotal(checkoutTable)} جنية</span>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  سيتم طباعة الفاتورة وتصفير حساب الطاولة وإغلاقها.
                </p>
              </div>
              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button onClick={confirmCheckout} className="w-full" size="lg">
                  <Printer className="h-4 w-4 ml-2" />
                  طباعة وإغلاق الحساب
                </Button>
                <Button variant="outline" onClick={() => setCheckoutTable(null)} className="w-full">
                  إلغاء
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
