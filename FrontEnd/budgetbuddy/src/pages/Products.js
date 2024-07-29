import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../contexts/AuthContext";
import {
    faMoneyBill,
    faBagShopping,
    faCreditCard,
    faBullseye,
    faUpload,
    faCamera,
    faCalendar,
    faDollarSign
} from "@fortawesome/free-solid-svg-icons";
import "../css/Products.css"; // Ensure you have corresponding CSS for styling
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";

export const Products = () => {

    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    return (
        <div className="products">
            <div className="products_header">
                <h1>Financial Products</h1>
            </div>

            <div className="product_layout">
                <aside><nav className="products_sidebar">
                        <ul>
                            <li>
                                <a href="#" className="active">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M13.333 3.33301H2.66634C1.92996 3.33301 1.33301 3.92996 1.33301 4.66634V11.333C1.33301 12.0694 1.92996 12.6663 2.66634 12.6663H13.333C14.0694 12.6663 14.6663 12.0694 14.6663 11.333V4.66634C14.6663 3.92996 14.0694 3.33301 13.333 3.33301Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M1.33301 6.66699H14.6663" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                                    <span>Credit Cards</span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="secondary icon">
                                            <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                    </a>
                            </li>
                            <li>
                                <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 10.6663C4 12.1391 5.19391 13.333 6.66667 13.333H9.33333C10.8061 13.333 12 12.1391 12 10.6663C12 9.19358 10.8061 7.99967 9.33333 7.99967H6.66667C5.19391 7.99967 4 6.80577 4 5.33301C4 3.86025 5.19391 2.66634 6.66667 2.66634H9.33333C10.8061 2.66634 12 3.86025 12 5.33301M8 1.33301V14.6663" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                                    <span>Loans</span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="secondary icon">
                                            <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 14H4.13333C3.3866 14 3.01323 14 2.72801 13.8547C2.47713 13.7268 2.27316 13.5229 2.14532 13.272C2 12.9868 2 12.6134 2 11.8667V2M4.66667 6.33333V11.6667M7.66667 8.66667V11.6667M10.6667 7V11.6667M13.6667 3.66667V11.6667" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M4.62988 3.68073L7.66697 6.66593L10.667 4.66592L13.5669 1.03328" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <ellipse cx="4.62988" cy="3.72168" rx="1" ry="1" fill="black"/>
                <circle cx="7.62598" cy="6.40137" r="1" fill="black"/>
                <ellipse cx="10.4932" cy="4.61035" rx="1" ry="1" fill="black"/>
                <circle cx="13.4785" cy="1.0332" r="1" fill="black"/>
                </svg>
                                    <span>ETFs</span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="secondary icon">
                                            <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg></a>
                            </li>
                            <li>
                                <a href="#"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="icon/shopping-bag">
                                        <path id="Vector" d="M4 1.33301L2 3.99967V13.333C2 13.6866 2.14048 14.0258 2.39052 14.2758C2.64057 14.5259 2.97971 14.6663 3.33333 14.6663H12.6667C13.0203 14.6663 13.3594 14.5259 13.6095 14.2758C13.8595 14.0258 14 13.6866 14 13.333V3.99967L12 1.33301H4Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path id="Vector_2" d="M2 4H14" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path id="Vector_3" d="M10.6663 6.66699C10.6663 7.37424 10.3854 8.05251 9.88529 8.55261C9.3852 9.05271 8.70692 9.33366 7.99967 9.33366C7.29243 9.33366 6.61415 9.05271 6.11406 8.55261C5.61396 8.05251 5.33301 7.37424 5.33301 6.66699" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </g>
                                </svg>
                                    <span>Mutual Funds</span>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="secondary icon">
                                            <path id="Vector" d="M6 12L10 8L6 4" stroke="#334155" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                        </g>
                                    </svg></a>
                            </li>
                        </ul>
                    </nav></aside>
                
                <div className="products_main">
                    <div className="product_container">
                        <h2>TD First Class Travel® Visa Infinite* Card</h2>
                        <img src="https://www.td.com/content/dam/tdct/images/personal-banking/first-class-travel-en-comp27.jpeg" alt="TD Cash Back Visa Infinite* Card" />
                        <p>Earn up to <b>$700</b> in value-, including up to 75,000 TD Rewards Points2 and no Annual Fee for the first year. Conditions Apply. Account must be approved by September 3, 2024.</p>
                        <ul>
                            <li><b>$139</b> Annual Fee</li>
                            <li><b>20.99%</b> Interest: Purchases</li>
                            <li><b>22.99%</b> Interest: Cash Advances</li>
                        </ul>
                        <div className="product_footer">
                            <a className="btn-white" href="https://www.td.com/ca/en/personal-banking/products/credit-cards/travel-rewards/first-class-travel-visa-infinite-card">View Details</a>
                            <a className="btn-black" href="https://www.tdcanadatrust.com/products-services/banking/credit-cards/byb.jsp?card=FCtravel">Apply Now</a>
                        </div>
                    </div>
                    <div className="product_container">
                        <h2>TD Cash Back Visa* Card</h2>
                        <img src="https://www.td.com/content/dam/tdct/images/personal-banking/cash-back-infinite-visa-card-large-1-en.jpeg" alt="TD Cash Back Visa Infinite* Card" />
                        <p>Earn up to <b>$500 </b>in value, including 10% in Cash Back Dollars in the first 3 months on Bonus Eligible Purchases up to a total spend of $3,5001. Conditions apply. Account must be approved by January 6, 2025.</p>
                        <ul>
                            <li><b>$139 </b>Annual Fee</li>
                            <li><b>20.99%</b> Interest: Purchases</li>
                            <li><b>22.99%</b> Interest: Cash Advances</li>
                        </ul>
                        <div className="product_footer">
                            <a className="btn-white" href="https://www.td.com/ca/en/personal-banking/products/credit-cards/cash-back/cash-back-visa-infinite-card">View Details</a>
                            <a className="btn-black" href="https://www.tdcanadatrust.com/products-services/banking/credit-cards/byb.jsp?card=CBinfinite">Apply Now</a>
                        </div>
                    </div>
                    <div className="product_container">
                        <h2>TD® Aeroplan® Visa Infinite* Card</h2>
                        <img src="https://www.td.com/content/dam/tdct/images/personal-banking/app-banner-1-10-7-en.jpeg" alt="TD Cash Back Visa Infinite* Card" />
                        <p>Earn up to <b>$1,000</b> in value including up to 40,000 Aeroplan points3. Conditions Apply. Account must be approved by September 3, 2024.</p>
                        <ul>
                            <li><b>$139 </b>Annual Fee</li>
                            <li><b>20.99%</b> Interest: Purchases</li>
                            <li><b>22.99%</b> Interest: Cash Advances</li>
                        </ul>
                        <div className="product_footer">
                            <a className="btn-white" href="https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/aeroplan-visa-infinite-card">View Details</a>
                            <a className="btn-black" href="https://www.td.com/ca/en/personal-banking/byb/credit-cards?card=AVinfinite">Apply Now</a>
                        </div>
                    </div>
                    <div className="product_container">
                        <h2>RBC Visa Classic Low Rate Option</h2>
                        <img src="https://www.rbcroyalbank.com/credit-cards/_assets-custom/images/cards/clo_classiclowrate_en_sm@2x.png" alt="TD Cash Back Visa Infinite* Card" />
                        <p>Low interest rate on purchases and cash advances. Low annual fee.
                Purchase security and extended warranty insurance</p>
                        <ul>
                            <li><b>$20</b> Annual Fee</li>
                            <li><b>12.99%</b> Interest: Purchases</li>
                            <li><b>12.99%</b> Interest: Cash Advances</li>
                        </ul>
                        <div className="product_footer">
                            <a className="btn-white" href="https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/aeroplan-visa-infinite-card">View Details</a>
                            <a className="btn-black" href="https://www.td.com/ca/en/personal-banking/byb/credit-cards?card=AVinfinite">Apply Now</a>
                        </div>
                    </div>
                    <div className="product_container">
                        <h2>RBC Cash Back Mastercard</h2>
                        <img src="https://www.rbcroyalbank.com/credit-cards/_assets-custom/images/cards/mc1_cashbackmc_en_sm@2x.png" alt="TD Cash Back Visa Infinite* Card" />
                        <p>Get Unlimited Cash Back on Your Purchases2 with our no annual fee Cash Back credit card. Up to 2% back on groceries. Purchase security and extended warranty protection</p>
                        <ul>
                            <li><b>$0</b> Annual Fee</li>
                            <li><b>20.99%</b> Interest: Purchases</li>
                            <li><b>22.99%</b> Interest: Cash Advances</li>
                        </ul>
                        <div className="product_footer">
                            <a className="btn-white" href="https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/aeroplan-visa-infinite-card">View Details</a>
                            <a className="btn-black" href="https://www.td.com/ca/en/personal-banking/byb/credit-cards?card=AVinfinite">Apply Now</a>
                        </div>
                    </div>
                    <div className="product_container">
                        <h2>Tangerine Money-Back Credit Card</h2>
                        <img src="https://media.creditcardgenius.ca/credit-card-images/lg/tangerine-moneyback-mastercard.png" alt="TD Cash Back Visa Infinite* Card" />
                        <p>Tap into summer with the Tangerine Money-Back Credit Card. Get 2% back on your choice of categories like hotels, restaurants, or gas. Plus you can earn an extra 10% cash back on all purchases on $1,000 in spending over the first 2 months</p>
                        <ul>
                            <li><b>$0</b> Annual Fee</li>
                            <li><b>19.95%</b> Interest: Purchases</li>
                            <li><b>19.95%</b> Interest: Cash Advances</li>
                        </ul>
                        <div className="product_footer">
                            <a className="btn-white" href="https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/aeroplan-visa-infinite-card">View Details</a>
                            <a className="btn-black" href="https://www.td.com/ca/en/personal-banking/byb/credit-cards?card=AVinfinite">Apply Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}