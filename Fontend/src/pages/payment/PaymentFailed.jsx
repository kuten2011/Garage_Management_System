import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, Home } from 'lucide-react';

export default function PaymentFailed() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [errorInfo, setErrorInfo] = useState({
        responseCode: '',
        message: '',
        txnRef: ''
    });

    useEffect(() => {
        const responseCode = searchParams.get('responseCode');
        const customMessage = searchParams.get('message');

        setErrorInfo({
            responseCode: responseCode || 'N/A',
            message: customMessage || getErrorMessage(responseCode),
            txnRef: searchParams.get('txnRef') || 'N/A'
        });
    }, [searchParams]);

    const getErrorMessage = (code) => {
        const errorMessages = {
            '07': 'Giao dịch bị nghi ngờ gian lận',
            '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ',
            '10': 'Xác thực thông tin không đúng quá 3 lần',
            '11': 'Đã hết hạn chờ thanh toán (15 phút)',
            '12': 'Thẻ/Tài khoản bị khóa',
            '13': 'Nhập sai mật khẩu xác thực',
            '24': 'Khách hàng hủy giao dịch',
            '51': 'Tài khoản không đủ số dư',
            '65': 'Tài khoản vượt quá hạn mức giao dịch',
            '75': 'Ngân hàng thanh toán đang bảo trì',
            '79': 'Nhập sai mật khẩu quá số lần quy định',
        };
        return errorMessages[code] || 'Giao dịch không thành công';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                        <XCircle className="text-red-600" size={48} />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
                    Thanh toán thất bại
                </h1>
                <p className="text-center text-gray-600 mb-8">
                    Rất tiếc, giao dịch của bạn không thể hoàn tất
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-semibold text-gray-800 mb-1">
                                Mã lỗi: {errorInfo.responseCode}
                            </p>
                            <p className="text-gray-700 mb-2">{errorInfo.message}</p>
                            <p className="text-sm text-gray-600">
                                Mã đơn hàng: {errorInfo.txnRef}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 mb-2">
                        <strong>Một số lý do có thể:</strong>
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                        <li>Số dư tài khoản không đủ</li>
                        <li>Thông tin thẻ không chính xác</li>
                        <li>Hủy giao dịch trong quá trình thanh toán</li>
                        <li>Quá thời gian chờ thanh toán (15 phút)</li>
                        <li>Lỗi kết nối ngân hàng</li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/#contact')}
                        className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition"
                    >
                        Thử lại
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
                    >
                        <Home size={20} />
                        Về trang chủ
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600 mb-2">Cần hỗ trợ?</p>
                    <a
                    href="tel:0944799819"
                    className="text-blue-600 font-semibold hover:underline text-lg"
                    >
                    Hotline: 0944.799.819
                </a>
            </div>
        </div>
</div>
);
}