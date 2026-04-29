package DACNTT.garage.service;

import DACNTT.garage.config.VNPayConfig;
import DACNTT.garage.util.VNPayUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Map;
import java.util.TimeZone;
import java.util.TreeMap;

@Service
public class VNPayService {
    @Autowired
    private VNPayConfig vnPayConfig;

    public String createPaymentUrl(long amount, String ipAddress) {
        try {
            String txnRef = VNPayUtil.getRandomNumber(8);
            String orderInfo = generateOrderInfo(txnRef, amount);

            Map<String, String> vnpParams = new TreeMap<>();
            vnpParams.put("vnp_Version", vnPayConfig.getVersion());
            vnpParams.put("vnp_Command", vnPayConfig.getCommand());
            vnpParams.put("vnp_TmnCode", vnPayConfig.getTmnCode());
            vnpParams.put("vnp_Amount", String.valueOf(amount * 100));
            vnpParams.put("vnp_CurrCode", "VND");
            vnpParams.put("vnp_TxnRef", txnRef);
            vnpParams.put("vnp_OrderInfo", orderInfo);
            vnpParams.put("vnp_OrderType", vnPayConfig.getOrderType());
            vnpParams.put("vnp_Locale", "vn");
            vnpParams.put("vnp_ReturnUrl", vnPayConfig.getReturnUrl());
//            vnpParams.put("vnp_IpnUrl", vnPayConfig.getIpnUrl());
            vnpParams.put("vnp_IpAddr", ipAddress);

            Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
            SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
            String vnpCreateDate = formatter.format(cld.getTime());
            vnpParams.put("vnp_CreateDate", vnpCreateDate);

            cld.add(Calendar.MINUTE, 15);
            String vnpExpireDate = formatter.format(cld.getTime());
            vnpParams.put("vnp_ExpireDate", vnpExpireDate);

            StringBuilder query = new StringBuilder();
            for (Map.Entry<String, String> entry : vnpParams.entrySet()) {
                query.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII));
                query.append("=");
                query.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
                query.append("&");
            }
            query.deleteCharAt(query.length() - 1);

            String queryUrl = query.toString();
            String vnpSecureHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), queryUrl);
            queryUrl += "&vnp_SecureHash=" + vnpSecureHash;

            return vnPayConfig.getUrl() + "?" + queryUrl;

        } catch (Exception e) {
            throw new RuntimeException("Error creating VNPay payment URL", e);
        }
    }

    private String generateOrderInfo(String txnRef, long amount) {
        return "HD" + txnRef;
    }

    public boolean verifyPayment(Map<String, String> params) {
        String vnpSecureHash = params.get("vnp_SecureHash");
        params.remove("vnp_SecureHash");
        params.remove("vnp_SecureHashType");

        Map<String, String> sortedParams = new TreeMap<>(params);

        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : sortedParams.entrySet()) {
            hashData.append(entry.getKey()).append("=").append(entry.getValue()).append("&");
        }
        hashData.deleteCharAt(hashData.length() - 1);

        String calculatedHash = VNPayUtil.hmacSHA512(vnPayConfig.getHashSecret(), hashData.toString());

        return calculatedHash.equals(vnpSecureHash);
    }
}
