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
        const confirmation = Swal.fire({
            title: 'Batalkan Pembayaran?',
            text: 'Apakah Anda yakin ingin membatalkan pembayaran?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, batalkan',
            cancelButtonText: 'Tidak, lanjutkan pembayaran',
        });
    
        // Jika pengguna mengonfirmasi pembatalan
        if (confirmation.isConfirmed) {
            // Reset state terkait QRIS
            setUrlVendor('');
            setCzQr(false);
            setCzUri('');
            // Panggil fungsi onClose untuk menutup modal
            onClose();
        } else {
            // Pengguna memutuskan untuk tidak membatalkan pembayaran
            console.log('Pembayaran dilanjutkan');
        }
        resetState();
        onClose();
    }, [resetState, onClose]);

    if (!isOpen) return null;

    // const handleClose = async () => {
    //     const confirmation = await Swal.fire({
    //         title: 'Batalkan Pembayaran?',
    //         text: 'Apakah Anda yakin ingin membatalkan pembayaran?',
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonText: 'Ya, batalkan',
    //         cancelButtonText: 'Tidak, lanjutkan pembayaran',
    //     });
    
    //     // Jika pengguna mengonfirmasi pembatalan
    //     if (confirmation.isConfirmed) {
    //         // Reset state terkait QRIS
    //         setUrlVendor('');
    //         setCzQr(false);
    //         setCzUri('');
    //         // Panggil fungsi onClose untuk menutup modal
    //         onClose();
    //     } else {
    //         // Pengguna memutuskan untuk tidak membatalkan pembayaran
    //         console.log('Pembayaran dilanjutkan');
    //     }
    // };
    

    if (!isOpen) return null;

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handlePayment = async () => {
        setIsProcessing(true);
        isCriticalOperation.current = true;
        try {
            console.log('Starting payment process');
            const receipt_id = `BEETPOS-1-${Math.floor(Date.now() / 1000)}`;
      
            const payload = {
                kodeproduk: 'TES1', 
                number: phoneNumber,
                counter: 1,
                receipt_id, 
                business_id: 12, 
                outlet_id: 1,
                kios_product_id: product.id, // Ensure this is properly defined
                customer_account_id: null, // Replace with valid value if needed
                customer_id: null, // Replace with valid value if needed
                description: 'Transaction from customer',
                status: 'new',
                device: 'web',  
                payment_discount: 0,
                payment_tax: 0,
                payment_service: 0,   
                payment_total: product.price,  
                payment_method: '',
                amount: product.price,
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
      
                startCheckingPaymentStatus(generatedUrl, receipt_id);
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
    
      const sendTransactionPayload = async (payload) => {
        try {
            // Log the payload to ensure it contains the required fields
            console.log("Sending payload:", payload);
            const token = localStorage.getItem('token');
                console.log("token:", token);
            const responsePayload = await fetch('https://api.beetpos.com/api/v1/kios-transaction/transaction-mockup-full', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo5LCJyb2xlX2lkIjo2NzMsImlzX3ZlcmlmaWVkIjpmYWxzZSwibGFzdF9sb2dpbiI6IjIwMjQtMDgtMjdUMDc6MzA6MjEuMDAwWiIsImlzX2xvZ2luIjp0cnVlLCJidXNpbmVzc19pZCI6MSwib3V0bGV0X2lkIjoxLCJpYXQiOjE3MjY1NjE3Njd9.OSpgHpyaCKvGZCFQ1ENn_FSqYnWLMIcp9dTZ9RXMFmw'
                },
                body: JSON.stringify(payload)
            });
    
            const response = await responsePayload.json();
            console.log("Original API Response:", response);
    
            if (responsePayload.ok && response.statusCode === 201) {
                console.log("Original transaction successful");
            } else {
                throw new Error(`Original transaction failed: ${response.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Error sending transaction payload:", error);
        }
    };
    
    
        const startCheckingPaymentStatus = (newGeneratedUrl, uniqueId, payload) => {
        let isProcessing = false;
        
        const id = setInterval(async () => {
          if (isProcessing) return;
          isProcessing = true;
        
          try {
              console.log("Checking payment status..."); // Log saat memeriksa status
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
        
              console.log("Payment status response:", response.data.data.response.processStatus); // Log respons status pembayaran
        
              if (response.data.data.response.processStatus === "APPROVED") {
                  clearInterval(id);
                  setIntervalId(null);
                  setIsPaymentApproved(true);
        
                  const responsePaymentType = response.data.data.response.paymentType.name;
        
                  console.log('Payment approved', {
                      uniqueId,
                      responsePaymentType,
                  });
        
                  // Kirim payload setelah status pembayaran disetujui
                  await sendTransactionPayload(payload); // Mengirimkan payload
                  console.log("Payload sent after payment approval:", payload); // Log payload yang dikirim
        
                //   handleClose();
              }
          } catch (error) {
              console.log("Error in payment status check:", error); // Log error saat memeriksa status
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

                        {/* <div className="mb-4 mt-7">
                            <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700">Select Payment Method</label>
                            <select
                                id="payment-method"
                                value={paymentMethod}
                                onChange={handlePaymentMethodChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                            >
                                <option value="">Silahkan pilih Pembayaran</option>
                                <option value="cash">Cash</option>
                                <option value="qris">QRIS dan Lainnya</option>
                            </select>
                        </div> */}

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handlePayment}
                                disabled={isProcessing}
                                className={`w-full px-8 py-2 font-bold ${isProcessing ? 'bg-gray-400' : 'bg-sky-500'} text-white rounded hover:bg-sky-600`}
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
