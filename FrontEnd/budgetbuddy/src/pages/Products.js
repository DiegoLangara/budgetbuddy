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
  faDollarSign,
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
      
      </div>

      <div className="product_layout">
        <aside>
          <nav className="products_sidebar">
            <ul>
            <li>
                <a href="#" className="active">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 10.6663C4 12.1391 5.19391 13.333 6.66667 13.333H9.33333C10.8061 13.333 12 12.1391 12 10.6663C12 9.19358 10.8061 7.99967 9.33333 7.99967H6.66667C5.19391 7.99967 4 6.80577 4 5.33301C4 3.86025 5.19391 2.66634 6.66667 2.66634H9.33333C10.8061 2.66634 12 3.86025 12 5.33301M8 1.33301V14.6663"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>Bank Accounts</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="secondary icon">
                      <path
                        id="Vector"
                        d="M6 12L10 8L6 4"
                        stroke="#334155"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#" >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.333 3.33301H2.66634C1.92996 3.33301 1.33301 3.92996 1.33301 4.66634V11.333C1.33301 12.0694 1.92996 12.6663 2.66634 12.6663H13.333C14.0694 12.6663 14.6663 12.0694 14.6663 11.333V4.66634C14.6663 3.92996 14.0694 3.33301 13.333 3.33301Z"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1.33301 6.66699H14.6663"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>Credit Cards</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="secondary icon">
                      <path
                        id="Vector"
                        d="M6 12L10 8L6 4"
                        stroke="#334155"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </a>
              </li>

              <li>
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M14 14H4.13333C3.3866 14 3.01323 14 2.72801 13.8547C2.47713 13.7268 2.27316 13.5229 2.14532 13.272C2 12.9868 2 12.6134 2 11.8667V2M4.66667 6.33333V11.6667M7.66667 8.66667V11.6667M10.6667 7V11.6667M13.6667 3.66667V11.6667"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.62988 3.68073L7.66697 6.66593L10.667 4.66592L13.5669 1.03328"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <ellipse
                      cx="4.62988"
                      cy="3.72168"
                      rx="1"
                      ry="1"
                      fill="black"
                    />
                    <circle cx="7.62598" cy="6.40137" r="1" fill="black" />
                    <ellipse
                      cx="10.4932"
                      cy="4.61035"
                      rx="1"
                      ry="1"
                      fill="black"
                    />
                    <circle cx="13.4785" cy="1.0332" r="1" fill="black" />
                  </svg>
                  <span>ETFs</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="secondary icon">
                      <path
                        id="Vector"
                        d="M6 12L10 8L6 4"
                        stroke="#334155"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </a>
              </li>
              <li>
                <a href="#">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="icon/shopping-bag">
                      <path
                        id="Vector"
                        d="M4 1.33301L2 3.99967V13.333C2 13.6866 2.14048 14.0258 2.39052 14.2758C2.64057 14.5259 2.97971 14.6663 3.33333 14.6663H12.6667C13.0203 14.6663 13.3594 14.5259 13.6095 14.2758C13.8595 14.0258 14 13.6866 14 13.333V3.99967L12 1.33301H4Z"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        id="Vector_2"
                        d="M2 4H14"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        id="Vector_3"
                        d="M10.6663 6.66699C10.6663 7.37424 10.3854 8.05251 9.88529 8.55261C9.3852 9.05271 8.70692 9.33366 7.99967 9.33366C7.29243 9.33366 6.61415 9.05271 6.11406 8.55261C5.61396 8.05251 5.33301 7.37424 5.33301 6.66699"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                  <span>Mutual Funds</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="secondary icon">
                      <path
                        id="Vector"
                        d="M6 12L10 8L6 4"
                        stroke="#334155"
                        strokeWidth="1.33333"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="products_main bank_accounts">
        <div className="product_container">
  <h2>EQ Bank Personal Account</h2>
  <img src="https://www.eqbank.ca/docs/default-source/webp/eq_spa_img_phoneandcard_personalaccount_550x550_en_v1.webp" alt="EQ Bank Personal Account" />
  <p>
    High interest with unlimited transactions and no monthly fees. Earn up to 4% interest on your deposits, no ATM fees (refunded by EQ Bank), 0.5% cash back on debit card purchases, and no foreign exchange fees.
  </p>
  <ul>
    <li>
      <b>$0</b> Monthly Fee
    </li>
    <li>
      <b>$0</b> Transaction Fee
    </li>
    <li>
      <b>$0</b> E-Transfer Fee
    </li>
  </ul>
  <div className="product_footer">
    <a className="btn-white" target="_blank" href="https://www.eqbank.ca/personal-banking/personal-account?icid=pa-hpbanner-learnmore">
      View Details
    </a>
    <a className="btn-black" target="_blank" href="https://join.eqbank.ca/?icid=spa-banner-joinnow&_gl=1*1isr1t2*_gcl_au*OTc4Mzk3ODYxLjE3MjI0MjAzMjk.*_ga*MTM4MzY5NjQ0OC4xNzIyNDIwMzMw*_ga_M1FM37GN6F*MTcyMjQyMDMyOS4xLjEuMTcyMjQyMDM2MS4yOC4wLjA.">
      Apply Now
    </a>
  </div>
</div>

<div className="product_container">
  <h2>Simplii No Fee Chequing Account</h2>
  <img src="https://www.simplii.com/content/dam/simplii-assets/global/card-art/debit-card/mastercard-debit/simplii-debit-card-two-mastercard-debit-static-front-tilted-en.png/_jcr_content/renditions/cq5dam.web.1280.1280.png" alt="Simplii No Fee Chequing Account" />
  <p>
    No monthly fees, free transactions, and a generous sign-up bonus. Earn up to $400 welcome bonus, unlimited free transactions and e-Transfers, and access to over 3,400 CIBC ATMs across Canada.
  </p>
  <ul>
    <li>
      <b>$0</b> Monthly Fee
    </li>
    <li>
      <b>$0</b> Transaction Fee
    </li>
    <li>
      <b>$0</b> E-Transfer Fee
    </li>
  </ul>
  <div className="product_footer">
    <a className="btn-white" target="_blank" href="https://www.simplii.com/en/bank-accounts/no-fee-chequing.html">
      View Details
    </a>
    <a className="btn-black" target="_blank" href="https://www.simplii.com/content/experience-fragments/simpliipublic/default-content/modal/simplii-online-banking-client/no-fee-chequing.html">
      Apply Now
    </a>
  </div>
</div>

<div className="product_container">
  <h2>BMO Performance Chequing Account</h2>
  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSthTwQ_pD4_aY7R9_aT7CYM__JYkjKXvHprA&s" alt="BMO Performance Chequing Account" />
  <p>
    Popular chequing account with unlimited free transactions and e-Transfers. Earn up to a $600 cash bonus, fee rebate on the BMO Mastercard annual fee, and part of the BMO Family Bundle for up to 20 accounts.
  </p>
  <ul>
    <li>
      <b>$17.95</b> Monthly Fee
    </li>
    <li>
      <b>$0</b> Transaction Fee
    </li>
    <li>
      <b>$0</b> E-Transfer Fee
    </li>
  </ul>
  <div className="product_footer">
    <a className="btn-white" target="_blank" href="https://www.bmo.com/en-ca/main/personal/bank-accounts/chequing-accounts/performance/">
      View Details
    </a>
    <a className="btn-black" target="_blank" href="https://www.bmo.com/open-account/?rg=BMO&spc=6109010&ofid=EQPCOPCMP00&spc2=0724PRI&ofid2=SAAPRI0724&lang=en&ab=true">
      Apply Now
    </a>
  </div>
</div>

<div className="product_container">
  <h2>National Bank of Canada Chequing Account for Newcomers</h2>
  <img src="https://www.nbc.ca/personal/accounts/services/online/features/mobile-deposit/_jcr_content/root/responsivegrid/landmarks/responsivegrid_1416824118/responsivegrid_copy_/responsivegrid_566700220/image.bncimg.100.991.xs.png/1700588336058/img-mobileapp-767x400-fr.png" alt="National Bank of Canada Chequing Account for Newcomers" />
  <p>
    Tailored for newcomers with zero account fees for up to three years. Assistance to Newcomers line, eligibility for a National Bank Mastercard without Canadian credit history, and $100 cash back welcome offer.
  </p>
  <ul>
    <li>
      <b>$0 for up to three years ($15.95 thereafter)</b> Monthly Fee
    </li>
    <li>
      <b>$1.50 for in-branch transactions</b> Transaction Fee
    </li>
    <li>
      <b>$0</b> E-Transfer Fee
    </li>
  </ul>
  <div className="product_footer">
    <a className="btn-white" target="_blank" href="https://www.nbc.ca/personal/accounts/newcomers.html">
      View Details
    </a>
    <a className="btn-black" target="_blank" href="https://open-personal-account.nbc.ca/start/?questionId_appt_ch=14&questionId_canal=NBC.CA&productId=CE-CHEQUE&packageId=NOUV-ARRIV&conditionId=DFLT&language=EN&exitUrl=personal/accounts.html">
      Apply Now
    </a>
  </div>
</div>

<div className="product_container">
  <h2>PC Financial PC Money Account</h2>
  <img src="https://www.pcfinancial.ca/static/58c482597e7076a61d84acb8240cbfe6/fe864/PCMA_Award_English.webp" alt="PC Financial PC Money Account" />
  <p>
    No monthly fees with the ability to earn PC Optimum points. Unlimited everyday and e-Transfer transactions, and in-person support at PC Financial pavilions.
  </p>
  <ul>
    <li>
      <b>$0</b> Monthly Fee
    </li>
    <li>
      <b>$0</b> Transaction Fee
    </li>
    <li>
      <b>$0</b> E-Transfer Fee
    </li>
  </ul>
  <div className="product_footer">
    <a className="btn-white" target="_blank" href="https://www.pcfinancial.ca/en/pc-money-account/">
      View Details
    </a>
    <a className="btn-black" target="_blank" href="https://secure.pcfinancial.ca/en/applications/individual/?sourceCode=INT&promoCode=90891&_gl=1*y5h8vw*_gcl_au*MTE2MTQ0NDExMy4xNzIyNDIwMjg0*_ga*ODYyNDE0MTQ2LjE3MjI0MjAyODQ.*_ga_JDEZPSSYQC*MTcyMjQyMDI4My4xLjEuMTcyMjQyMDMwNi4zNy4wLjA.">
      Apply Now
    </a>
  </div>
</div>

<div className="product_container">
  <h2>Alterna Bank No Fee eChequing Account</h2>
  <img src="https://pbs.twimg.com/media/GG4waeFXQAA_1QB.jpg" alt="Alterna Bank No Fee eChequing Account" />
  <p>
    No monthly fees or minimum balance requirements. Free and unlimited daily transactions and e-Transfers, access to over 3,300 ATMs in THE EXCHANGE® Network, and interest on your balance (0.05%).
  </p>
  <ul>
    <li>
      <b>$0</b> Monthly Fee
    </li>
    <li>
      <b>$0</b> Transaction Fee
    </li>
    <li>
      <b>$0</b> E-Transfer Fee
    </li>
  </ul>
  <div className="product_footer">
    <a className="btn-white" target="_blank" href="https://www.alternabank.ca/en/personal/accounts/no-fee-echequing">
      View Details
    </a>
    <a className="btn-black" target="_blank" href="https://apply.alternabank.ca/?prod=140">
      Apply Now
    </a>
  </div>
</div>

        </div>
       
        <div className="products_main credit_cards" style={{ display: "none" }}>
          <div className="product_container">
            <h2>TD First Class Travel® Visa Infinite* Card</h2>
            <img
              src="https://www.td.com/content/dam/tdct/images/personal-banking/first-class-travel-en-comp27.jpeg"
              alt="TD Cash Back Visa Infinite* Card"
            />
            <p>
              Earn up to <b>$700</b> in value-, including up to 75,000 TD
              Rewards Points2 and no Annual Fee for the first year. Conditions
              Apply. Account must be approved by September 3, 2024.
            </p>
            <ul>
              <li>
                <b>$139</b> Annual Fee
              </li>
              <li>
                <b>20.99%</b> Interest: Purchases
              </li>
              <li>
                <b>22.99%</b> Interest: Cash Advances
              </li>
            </ul>
            <div className="product_footer">
              <a
                className="btn-white"
                target="_blank"
                href="https://www.td.com/ca/en/personal-banking/products/credit-cards/travel-rewards/first-class-travel-visa-infinite-card"
              >
                View Details
              </a>
              <a
                className="btn-black"
                target="_blank"
                href="https://www.tdcanadatrust.com/products-services/banking/credit-cards/byb.jsp?card=FCtravel"
              >
                Apply Now
              </a>
            </div>
          </div>
          <div className="product_container">
            <h2>TD Cash Back Visa* Card</h2>
            <img
              src="https://www.td.com/content/dam/tdct/images/personal-banking/cash-back-entry-en.jpeg"
              alt="TD Cash Back Visa Infinite* Card"
            />
            <p>
              Earn up to <b>$500 </b>in value, including 10% in Cash Back
              Dollars in the first 3 months on Bonus Eligible Purchases up to a
              total spend of $3,5001. Conditions apply. Account must be approved
              by January 6, 2025.
            </p>
            <ul>
              <li>
                <b>$139 </b>Annual Fee
              </li>
              <li>
                <b>20.99%</b> Interest: Purchases
              </li>
              <li>
                <b>22.99%</b> Interest: Cash Advances
              </li>
            </ul>
            <div className="product_footer">
              <a
                className="btn-white"
                target="_blank"
                href="https://www.td.com/ca/en/personal-banking/products/credit-cards/cash-back/cash-back-visa-card"
              >
                View Details
              </a>
              <a
                className="btn-black"
                target="_blank"
                href="https://www.tdcanadatrust.com/products-services/banking/credit-cards/byb.jsp?card=CBvisa"
              >
                Apply Now
              </a>
            </div>
          </div>
          <div className="product_container">
            <h2>TD® Aeroplan® Visa Infinite* Card</h2>
            <img
              src="https://www.td.com/content/dam/tdct/images/personal-banking/app-banner-1-10-7-en.jpeg"
              alt="TD Cash Back Visa Infinite* Card"
            />
            <p>
              Earn up to <b>$1,000</b> in value including up to 40,000 Aeroplan
              points3. Conditions Apply. Account must be approved by September
              3, 2024.
            </p>
            <ul>
              <li>
                <b>$139 </b>Annual Fee
              </li>
              <li>
                <b>20.99%</b> Interest: Purchases
              </li>
              <li>
                <b>22.99%</b> Interest: Cash Advances
              </li>
            </ul>
            <div className="product_footer">
              <a
                className="btn-white"
                target="_blank"
                href="https://www.td.com/ca/en/personal-banking/products/credit-cards/aeroplan/aeroplan-visa-infinite-card"
              >
                View Details
              </a>
              <a
                className="btn-black"
                target="_blank"
                href="https://www.td.com/ca/en/personal-banking/byb/credit-cards?card=AVinfinite"
              >
                Apply Now
              </a>
            </div>
          </div>
          <div className="product_container">
            <h2>RBC Visa Classic Low Rate Option</h2>
            <img
              src="https://www.rbcroyalbank.com/credit-cards/_assets-custom/images/cards/clo_classiclowrate_en_sm@2x.png"
              alt="TD Cash Back Visa Infinite* Card"
            />
            <p>
              Low interest rate on purchases and cash advances. Low annual fee.
              Purchase security and extended warranty insurance
            </p>
            <ul>
              <li>
                <b>$20</b> Annual Fee
              </li>
              <li>
                <b>12.99%</b> Interest: Purchases
              </li>
              <li>
                <b>12.99%</b> Interest: Cash Advances
              </li>
            </ul>
            <div className="product_footer">
              <a
                className="btn-white"
                target="_blank"
                href="https://www.rbcroyalbank.com/credit-cards/low-interest/rbc-visa-classic-low-rate.html"
              >
                View Details
              </a>
              <a
                className="btn-black"
                target="_blank"
                href="https://apps.royalbank.com/uaw0/IAO/apply/cardapp?pid1=classic_lr&ASC=IAP014&_gl=1*1f4z693*_gcl_aw*R0NMLjE3MjIyODA0NDAuQ2owS0NRanctNXkxQmhDLUFSSXNBQU1fb0tsdWtCQXZoRE94SjQwQnhLRFVJOGswcWRsNTRLN1docU91LU1QbFFJYldKb2IzbWxuUS1QRWFBbEhQRUFMd193Y0I.*_gcl_au*MTA3NTE1MTk0MS4xNzIyMjgwNDM3*_ga*MTUzMjgwNzc1Ny4xNzIyMjgwNDM4*_ga_89NPCTDXQR*MTcyMjI4MDQzOS4xLjEuMTcyMjI4MDQ2MC4zOS4wLjA."
              >
                Apply Now
              </a>
            </div>
          </div>
          <div className="product_container">
            <h2>RBC Cash Back Mastercard</h2>
            <img
              src="https://www.rbcroyalbank.com/credit-cards/_assets-custom/images/cards/mc1_cashbackmc_en_sm@2x.png"
              alt="TD Cash Back Visa Infinite* Card"
            />
            <p>
              Get Unlimited Cash Back on Your Purchases2 with our no annual fee
              Cash Back credit card. Up to 2% back on groceries. Purchase
              security and extended warranty protection
            </p>
            <ul>
              <li>
                <b>$0</b> Annual Fee
              </li>
              <li>
                <b>20.99%</b> Interest: Purchases
              </li>
              <li>
                <b>22.99%</b> Interest: Cash Advances
              </li>
            </ul>
            <div className="product_footer">
              <a
                className="btn-white"
                target="_blank"
                href="https://www.rbcroyalbank.com/credit-cards/cash-back/rbc-cashback-mastercard.html"
              >
                View Details
              </a>
              <a
                className="btn-black"
                target="_blank"
                href="https://apps.royalbank.com/uaw0/IAO/apply/cardapp?pid1=cashback_mc&ASC=MC1024&_gl=1*6uj9n2*_gcl_aw*R0NMLjE3MjIyODA0NDAuQ2owS0NRanctNXkxQmhDLUFSSXNBQU1fb0tsdWtCQXZoRE94SjQwQnhLRFVJOGswcWRsNTRLN1docU91LU1QbFFJYldKb2IzbWxuUS1QRWFBbEhQRUFMd193Y0I.*_gcl_au*MTA3NTE1MTk0MS4xNzIyMjgwNDM3*_ga*MTUzMjgwNzc1Ny4xNzIyMjgwNDM4*_ga_89NPCTDXQR*MTcyMjI4MDQzOS4xLjEuMTcyMjI4MDUxNS41NC4wLjA."
              >
                Apply Now
              </a>
            </div>
          </div>
          <div className="product_container">
            <h2>Tangerine Money-Back Credit Card</h2>
            <img
              src="https://media.creditcardgenius.ca/credit-card-images/lg/tangerine-moneyback-mastercard.png"
              alt="TD Cash Back Visa Infinite* Card"
            />
            <p>
              Tap into summer with the Tangerine Money-Back Credit Card. Get 2%
              back on your choice of categories like hotels, restaurants, or
              gas. Plus you can earn an extra 10% cash back on all purchases on
              $1,000 in spending over the first 2 months
            </p>
            <ul>
              <li>
                <b>$0</b> Annual Fee
              </li>
              <li>
                <b>19.95%</b> Interest: Purchases
              </li>
              <li>
                <b>19.95%</b> Interest: Cash Advances
              </li>
            </ul>
            <div className="product_footer">
              <a
                className="btn-white"
                target="_blank"
                href="https://www.tangerine.ca/en/personal/spend/credit-cards/world-credit-card"
              >
                View Details
              </a>
              <a
                className="btn-black"
                target="_blank"
                href="https://www.tangerine.ca/en/personal/spend/credit-cards/world-credit-card#openAccountModal"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
