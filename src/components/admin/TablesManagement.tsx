import { useState } from 'react';
import { Plus, Trash2, QrCode, Printer, Download, ExternalLink } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useAdmin } from '@/contexts/AdminContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function TablesManagement() {
  const { tables, addTable, deleteTable, toggleTableStatus } = useAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<{ number: number; qrCode: string } | null>(null);
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
            <h1>مطعم الذواقة</h1>
            <h2>طاولة رقم ${tableNumber}</h2>
            <div class="qr">
              <img src="${document.getElementById(`qr-${tableNumber}`)?.querySelector('svg')?.outerHTML 
                ? `data:image/svg+xml,${encodeURIComponent(document.getElementById(`qr-${tableNumber}`)?.querySelector('svg')?.outerHTML || '')}`
                : ''}" width="200" height="200" />
            </div>
            <p>امسح الكود للطلب</p>
          </div>
          <script>
            // Generate QR code using canvas
            const canvas = document.createElement('canvas');
            // Print after a small delay
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
        {tables.map((table) => (
          <div
            key={table.id}
            className={`bg-card rounded-xl p-5 shadow-card transition-all ${
              !table.isActive ? 'opacity-60' : ''
            }`}
          >
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
            <p className={`text-sm mb-4 ${table.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
              {table.isActive ? 'نشطة' : 'غير نشطة'}
            </p>

            {/* QR Code Preview */}
            <div 
              id={`qr-${table.number}`} 
              className="bg-white rounded-lg p-3 mb-4 flex items-center justify-center"
            >
              <QRCodeSVG
                value={`${baseUrl}${table.qrCode}`}
                size={100}
                level="H"
                includeMargin
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleViewQR(table)}
              >
                <QrCode className="h-4 w-4 ml-1" />
                عرض
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePrintQR(table.number)}
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTable(table.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
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
    </div>
  );
}
