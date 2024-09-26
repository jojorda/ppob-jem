import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const TransactionModal = ({ isOpen, onClose, phoneNumber, product }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate();
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [urlVendor, setUrlVendor] = useState('');
    const [czQr, setCzQr] = useState(false);
    const [czUri, setCzUri] = useState('');
    const [intervalId, setIntervalId] = useState(null);
    const [isPaymentApproved, setIsPaymentApproved] = useState(false);
    const isCriticalOperation = useRef(false);

    const resetState = useCallback(() => {
        setIsProcessing(false);
        setUrlVendor('');
        setCzQr(false);
        setCzUri('');
        setIsPaymentApproved(false);
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        isCriticalOperation.current = false;
    }, [intervalId]);

    useEffect(() => {
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [intervalId]);

    const handleClose = useCallback(() => {
        Swal.fire({
            title: 'Batalkan Pembayaran?',
            text: 'Apakah Anda yakin ingin membatalkan pembayaran?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, batalkan',
            cancelButtonText: 'Tidak, lanjutkan pembayaran',
        }).then((result) => {
            if (result.isConfirmed) {
                resetState();
                onClose();
            } else {
                console.log('Pembayaran dilanjutkan');
            }
        });
    }, [resetState, onClose]);

    if (!isOpen) return null;

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleQrisPayment = async () => {
        setIsProcessing(true);
        isCriticalOperation.current = true;
        try {
            console.log('Starting QRIS payment process');
            // const amountPaid = 10000; 

            const payment_discount = 0; 
            const payment_tax = 0; 
            const payment_service = 0; 
            const payment_total = product.price + payment_service + payment_tax - payment_discount;
            
            // const payment_change = amountPaid - payment_total;
            const receipt_id = `BEETPOS-1-${Math.floor(Date.now() / 1000)}`;
      
            const payload = {
                kodeproduk: 'TES1', 
                number: phoneNumber,
                counter: 1,
                receipt_id, 
                business_id: 12, 
                outlet_id: 1,
                kios_product_id: product.id,
                customer_account_id: null,
                customer_id: null,
                description: 'Transaction QR from customer',
                status: 'done',
                device: 'web',  
                payment_discount,
                payment_tax,
                payment_service,   
                payment_total,  
                payment_method: 'QRIS',
                amount: payment_total,
                payment_fee: product.additional_cost || 0,
                payment_admin: product.admin_cost || 0,
                payment_change: 0 
            };
            
            console.log("Payload before sending transaction:", payload);
            
            const generateSignature = {
                data: {
                    request: {
                        vendorIdentifier: 'CZ00LTCH001',
                        token: '',
                        referenceId: receipt_id,
                        entityId: '30217',
                        merchantName: 'Lifetech-BeetPOS',
                        merchantDescription: 'Beetpos Transaction',
                        currencyCode: 'IDR',
                        payment_tax: 0,
                        payment_service: 0,
                        payment_total: payload.payment_total,
                        amount: payload.amount,
                        callbackSuccess: '',
                        callbackFailure: '',
                        message: '',
                        description: 'Transaction',
                        transactionUsername: 'lifetech',
                    },
                },
                signature: '',
            };
            console.log("Generate Signature:", generateSignature);
      
            const resSignature = await axios.post(
                'https://api.beetpos.com/api/v1/signature/generate',
                generateSignature,
            );
            generateSignature.signature = resSignature.data.data[0].result;
            console.log('Signature generated:', generateSignature.signature);
      
            const generateUrlVendor = await axios.post(
                `https://api.beetpos.com/api/v1/signature/generate-url-vendor`,
                generateSignature
            );
      
            console.log('Generated URL vendor response:', generateUrlVendor);
      
            if (
                generateUrlVendor.data &&
                generateUrlVendor.data.data &&
                generateUrlVendor.data.data.response
            ) {
                const generatedUrl = generateUrlVendor.data.data.response.generatedUrl;
                const qrisUrl = `https://link.cashlez.com/czlink/${generatedUrl
                    .split('/')
                    .pop()}`;
                console.log('Generated QRIS URL:', qrisUrl);
      
                setUrlVendor(qrisUrl);
                setCzQr(true);
                setCzUri(qrisUrl);
                console.log('After setting states: urlVendor:', qrisUrl, 'czQr:', true);
      
                startCheckingPaymentStatus(generatedUrl, receipt_id, payload);
            } else {
                throw new Error('Failed to generate vendor URL');
            }
      
        } catch (error) {
            console.error('Error processing transaction:', error);
            alert('Transaction failed: ' + error.message);
            resetState();
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCashPayment = async () => {
        setIsProcessing(true);
        try {
            console.log('Starting Cash payment process');
            const amountPaid = 10000; 

            const payment_discount = 0; 
            const payment_tax = 0; 
            const payment_service = 0; 
            const payment_total = product.price + payment_service + payment_tax - payment_discount;
            
            const payment_change = amountPaid - payment_total;
            const receipt_id = `BEETPOS-1-${Math.floor(Date.now() / 1000)}`;
      
            const payload = {
                kodeproduk: 'TES1', 
                number: phoneNumber,
                counter: 1,
                receipt_id, 
                business_id: 12, 
                outlet_id: 1,
                kios_product_id: product.id,
                customer_account_id: null,
                customer_id: null,
                description: 'Cash Transaction from customer',
                status: 'done',
                device: 'web',  
                payment_discount, 
                payment_tax, 
                payment_service, 
                payment_total, 
                payment_method: 'Cash',
                amount: amountPaid,
                payment_fee: product.additional_cost || 0,
                payment_admin: product.admin_cost || 0,
                payment_change 
            };
            
            console.log("Payload for cash transaction:", payload);
            
            await sendTransactionPayload(payload);
            
            Swal.fire({
                title: 'Payment Successful<br>Silahkan Bayar di Kasir!',
                html: 'Pembayaran tunai telah berhasil diproses.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                resetState();
                onClose();
                navigate('/'); 
            });

        } catch (error) {
            console.error('Error processing cash transaction:', error);
            Swal.fire({
                title: 'Transaction Failed',
                text: error.message || 'An error occurred while processing the cash payment.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsProcessing(false);
        }
    };
    
    const sendTransactionPayload = async (payload) => {
        try {
            console.log("Sending payload:", payload);
            const token = localStorage.getItem('token');
            console.log("token:", token);
            const responsePayload = await fetch('https://api.beetpos.com/api/v1/kios-transaction/transaction-mockup-full', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJyb2xlX2lkIjo2NzMsImlzX3ZlcmlmaWVkIjpmYWxzZSwibGFzdF9sb2dpbiI6IjIwMjQtMDgtMjdUMDc6MzA6MjEuMDAwWiIsImlzX2xvZ2luIjp0cnVlLCJidXNpbmVzc19pZCI6MSwib3V0bGV0X2lkIjoxLCJpYXQiOjE3MjY1NjE3Njd9.OSpgHpyaCKvGZCFQ1ENn_FSqYnWLMIcp9dTZ9RXMFmw'
                },
                body: JSON.stringify(payload)
            });
    
            const response = await responsePayload.json();
            console.log("API Response:", response);
    
            if (responsePayload.ok && response.statusCode === 201) {
                console.log("Transaction successful");
                return response;
            } else {
                throw new Error(`Transaction failed: ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error sending transaction payload:", error);
            throw error;
        }
    };
    
    const startCheckingPaymentStatus = (newGeneratedUrl, uniqueId, payload) => {
        let isProcessing = false;
        
        const id = setInterval(async () => {
            if (isProcessing) return;
            isProcessing = true;
        
            try {
                console.log("Checking payment status...");
                const response = await axios.post(
                    "https://api-link.cashlez.com/validate_url",
                    {
                        status: "",
                        message: "",
                        data: {
                            request: {
                                generatedUrl: newGeneratedUrl,
                            },
                        },
                    }
                );
        
                console.log("Payment status response:", response.data.data.response.processStatus);
        
                if (response.data.data.response.processStatus === "APPROVED") {
                    clearInterval(id);
                    setIntervalId(null);
                    setIsPaymentApproved(true);
                    
                    const responsePaymentType = response.data.data.response.paymentType.name;
        
                    console.log('Payment approved', {
                        uniqueId,
                        responsePaymentType,
                    });
        
                    await sendTransactionPayload(payload);
                    console.log("Payload sent after payment approval:", payload);
        
                    // handleClose();
                    // navigate('/');
                    Swal.fire({
                        title: 'Payment Successful',
                        html: 'Pembayaran QRIS telah berhasil diproses.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        resetState();
                        onClose();
                        navigate('/'); 
                    });
                }
            } catch (error) {
                console.log("Error in payment status check:", error);
            } finally {
                isProcessing = false;
            }
        }, 2000);
        
        setIntervalId(id);
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex items-center mb-4 rounded bg-sky-500 h-[59px]">
                    <button onClick={handleClose} className="mr-4 text-white">
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold text-white">Konfirmasi Pembayaran</h1>
                </div>
                
                {!urlVendor ? (
                    <>
                        <div className="flex items-center mb-4">
                            <img src="https://flowbite.com/docs/images/logo.svg" alt={product.name} className="w-16 h-16 object-cover mr-4" />
                            <p className="text-sm font-semibold">{product.name}</p>
                        </div>

                        <div className="mb-2 flex justify-between">
                            <p className="text-left text-sm mt-1">Phone Number</p>
                            <p className="text-right font-semibold">{phoneNumber}</p>
                        </div>

                        <div className="mb-3 flex justify-between">
                            <p className="text-left text-sm mt-1">Total Harga</p>
                            <h2 className="text-right font-bold text-orange-500 text-lg">Rp {product.price.toLocaleString()}</h2>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                                Pilih Metode Pembayaran
                            </label>
                            <select
                                id="paymentMethod"
                                value={paymentMethod}
                                onChange={handlePaymentMethodChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="">Pilih metode</option>
                                <option value="cash">Cash</option>
                                <option value="qris">QRIS</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={paymentMethod === 'qris' ? handleQrisPayment : handleCashPayment}
                                disabled={isProcessing || !paymentMethod}
                                className={`w-full px-8 py-2 font-bold ${isProcessing || !paymentMethod ? 'bg-gray-400' : 'bg-sky-500'} text-white rounded hover:bg-sky-600`}
                            >
                                {isProcessing ? 'Processing...' : `BAYAR Rp${product.price.toLocaleString()}`}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full relative justify-center">
                        <iframe
                            src={urlVendor}
                            className="w-full h-[500px] border-none"
                            title="Payment Gateway"
                            allow="geolocation"
                        />
                        <button onClick={handleClose} className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2">
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionModal;