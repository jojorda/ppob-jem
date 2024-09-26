import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Swal from 'sweetalert2';

const TransactionModal = ({ isOpen, onClose, phoneNumber, product }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    if (!isOpen) return null;

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handlePayment = async () => {
        if (!paymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        // Show the SweetAlert confirmation dialog
        const confirmation = await Swal.fire({
            icon: "success",
            title: "Pembayaran Cash.",
            text: "Anda yakin Melakukan Pembayaran?",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            customClass: {
                title: "text-md",
            },
        });

        // If the user confirms, proceed with the payment
        if (confirmation.isConfirmed) {
            setIsProcessing(true); // Set state to show processing
            try {
                const receipt_id = `BEETPOS-${Math.floor(Date.now() / 1000)}`;  // Adjust outlet_id if necessary
                const requestBody = {
                    kodeproduk: 'TES1',
                    number: phoneNumber,
                    counter: 1,
                    receipt_id,
                    business_id: 12,
                    outlet_id: 1,
                    kios_product_id: product.id,
                    customer_account_id: null,
                    customer_id: null,
                    description: 'Transaction from customer',
                    status: 'new',
                    device: 'web',
                    payment_discount: 0,
                    payment_tax: 0,
                    payment_service: 0,
                    payment_total: product.price,
                    payment_method: paymentMethod,
                    amount: product.price,
                    payment_fee: product.additional_cost || 0,
                    payment_admin: product.additional_cost || 0,
                    payment_change: 0
                };

                console.log("Request Body:", requestBody);

                const response = await fetch('https://api.beetpos.com/api/v1/kios-transaction/transaction-mockup-full', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(requestBody)
                });

                console.log("Raw Response:", response);
                const data = await response.json();
                console.log("Parsed Response Data:", data);

                if (response.ok && data.statusCode === 201) {
                    // If the payment method is cash, show the custom message
                    if (paymentMethod === 'cash') {
                        Swal.fire('Success', 'Silahkan bayar di Kasir.', 'success').then(() => {
                            // After showing the success message, navigate to the main page
                            navigate('/');
                        });
                    } else {
                        Swal.fire('Success', 'Transaction successful!', 'success').then(() => {
                            navigate('/'); // Navigate to main page after successful transaction
                        });
                    }
                    onClose(); // Close modal
                } else {
                    Swal.fire('Error', `Transaction failed: ${data.message || 'Unknown error'}`, 'error');
                }
            } catch (error) {
                console.error('Error processing transaction:', error);
                Swal.fire('Error', 'Transaction failed: Please try again later.', 'error');
            } finally {
                setIsProcessing(false); // Reset the processing state
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                <div className="flex items-center mb-4 rounded bg-sky-500 h-[59px]">
                    <button onClick={onClose} className="mr-4 text-white">
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

                {/* Payment Method Dropdown */}
                <div className="mb-4 mt-7">
                    <label htmlFor="payment-method" className="block text-sm font-medium text-gray-700"> Select Payment Method</label>
                    <select
                        id="payment-method"
                        value={paymentMethod}
                        onChange={handlePaymentMethodChange}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    >
                        <option value="">Silahkan pilih Pembayaran</option>
                        <option value="qris">QRIS</option>
                        <option value="cash">Cash</option>
                    </select>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={handlePayment}
                        disabled={isProcessing} // Disable button while processing
                        className={`w-full px-8 py-2 font-bold ${isProcessing ? 'bg-gray-400' : 'bg-sky-500'} text-white rounded hover:bg-sky-600`}
                    >
                        {isProcessing ? 'Processing...' : `BAYAR Rp${product.price.toLocaleString()}`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionModal;
