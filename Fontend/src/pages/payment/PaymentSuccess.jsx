import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Home, Receipt } from 'lucide-react';

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState({
        transactionId: '',
        amount: 0,
        orderInfo: '',
        bankCode: '',
        paymentTime: '',
        txnRef: ''
    });

    useEffect(() => {
        // Lấy params từ URL (đã được backend gửi sang)
        setPaymentInfo({
            transactionId: searchParams.get('transactionId') || 'N/A',
            amount: searchParams.get('amount') ? parseInt(searchParams.get('amount')) / 100 : 0,
            orderInfo: searchParams.get('orderInfo') || 'Thanh toán dịch vụ',
            bankCode: searchParams.get('bankCode') || 'N/A',
            paymentTime: formatPayDate(searchParams.get('payDate')),
            txnRef: searchParams.get('txnRef') || 'N/A'
        });
    }, [searchParams]);

    const formatPayDate = (dateStr) => {
        if (!dateStr || dateStr.length !== 14) return new Date().toLocaleString('vi-VN');

        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const hour = dateStr.substring(8, 10);
        const minute = dateStr.substring(10, 12);
        const second = dateStr.substring(12, 14);

        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
                        <CheckCircle className="text-green-600" size={48} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Thanh toán thành công!
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Cảm ơn bạn đã sử dụng dịch vụ của Web Garage
                </p>

                <div className="bg-gray-50 rounded-lg p-6 mb-6 space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <span className="font-semibold text-gray-800">{paymentInfo.txnRef}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Mã giao dịch:</span>
                        <span className="font-semibold text-gray-800">{paymentInfo.transactionId}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Số tiền:</span>
                        <span className="font-bold text-green-600 text-xl">
              {paymentInfo.amount.toLocaleString('vi-VN')} VNĐ
            </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Nội dung:</span>
                        <span className="font-semibold text-gray-800 text-right text-sm">
              {paymentInfo.orderInfo}
            </span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <span className="text-gray-600">Ngân hàng:</span>
                        <span className="font-semibold text-gray-800">{paymentInfo.bankCode}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Thời gian:</span>
                        <span className="font-semibold text-gray-800 text-sm">{paymentInfo.paymentTime}</span>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Về trang chủ
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="w-full bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
                    >
                        <Receipt size={20} />
                        In hóa đơn
                    </button>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Chúng tôi đã ghi nhận giao dịch của bạn
                </p>
            </div>
        </div>
    );
}