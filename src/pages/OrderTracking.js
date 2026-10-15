import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { io } from "socket.io-client";
import {
  FaArrowLeft,
  FaCheck,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaTruck,
  FaUser,
  FaShoppingBag,
} from "react-icons/fa";

const Page = styled.div`
  background: #f8fafc;
  min-height: 100vh;
  padding: 24px 16px;
  font-family: "Inter", sans-serif;
  @media (min-width: 768px) {
    padding: 40px 24px;
  }
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #153d2b;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 24px;
  transition: transform 0.2s;
  &:hover {
    transform: translateX(-4px);
  }
`;

const TrackingCard = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  margin-bottom: 24px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  border-b: 1px solid #f1f5f9;
  padding-bottom: 20px;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  margin: 0 0 4px 0;
  font-size: 20px;
  font-weight: 900;
  color: #1e293b;
`;

const OrderId = styled.span`
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
`;

const DeliveryTime = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  padding: 10px 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 800;
`;

/* ── Stepper ── */
const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
  margin-left: 20px;
  &::before {
    content: "";
    position: absolute;
    left: -11px;
    top: 10px;
    bottom: 10px;
    width: 2px;
    background: #e2e8f0;
    z-index: 1;
  }
`;

const StepLineProgress = styled.div`
  position: absolute;
  left: -11px;
  top: 10px;
  width: 2px;
  background: #22c55e;
  z-index: 2;
  transition: height 0.5s ease-in-out;
  height: ${({ $percentage }) => $percentage}%;
`;

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  opacity: ${({ $active, $completed }) => ($active || $completed ? 1 : 0.5)};
  transition: opacity 0.3s;
`;

const StepDot = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ $active, $completed }) =>
    $completed ? "#22c55e" : $active ? "#153d2b" : "#fff"};
  border: 2px solid
    ${({ $active, $completed }) =>
      $completed ? "#22c55e" : $active ? "#153d2b" : "#cbd5e1"};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  position: absolute;
  left: -22px;
  top: 2px;
  z-index: 3;
  box-shadow: 0 0 0 4px #fff;
`;

const StepContent = styled.div``;

const StepTitle = styled.h4`
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 800;
  color: #1e293b;
`;

const StepDesc = styled.p`
  margin: 0;
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

/* ── Rider Details ── */
const RiderCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
`;

const RiderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const RiderAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

const RiderName = styled.h5`
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: #1e293b;
`;

const RiderTag = styled.span`
  font-size: 11px;
  color: #16a34a;
  font-weight: 700;
`;

const CallButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #153d2b;
  color: #fff;
  transition: transform 0.2s, background-color 0.2s;
  &:hover {
    background: #166534;
    transform: scale(1.05);
  }
`;

/* ── Animated Delivery Simulation ── */
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
  100% { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
`;

const MapContainer = styled.div`
  background: #e2e8f0;
  height: 200px;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  margin-top: 24px;
  border: 1px solid #cbd5e1;
`;

const AnimatedRoad = styled.div`
  position: absolute;
  top: 50%;
  left: 10%;
  right: 10%;
  height: 6px;
  background: #94a3b8;
  border-radius: 3px;
  transform: translateY(-50%);
  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      90deg,
      #fff,
      #fff 10px,
      transparent 10px,
      transparent 20px
    );
  }
`;

const ProgressDot = styled.div`
  position: absolute;
  top: 50%;
  left: ${({ $progress }) => $progress}%;
  width: 32px;
  height: 32px;
  background: #16a34a;
  border: 3px solid #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  transform: translate(-50%, -50%);
  transition: left 1s ease-in-out;
  animation: ${pulseGlow} 2s infinite;
  z-index: 10;
`;

const DestinationMarker = styled.div`
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translate(50%, -50%);
  color: #ef4444;
  font-size: 24px;
  z-index: 5;
`;

const StoreMarker = styled.div`
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translate(-50%, -50%);
  color: #153d2b;
  font-size: 20px;
  z-index: 5;
`;

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("Placed"); // Placed, Packing, Delivering, Completed
  const [progress, setProgress] = useState(10); // 10%, 40%, 75%, 100%

  // Status mapping
  const steps = [
    { title: "Order Placed", desc: "We have received your order", key: "Placed" },
    { title: "Packing Essentials", desc: "Our store staff is packing your items", key: "Packing" },
    { title: "Out for Delivery", desc: "Rider is heading to your location", key: "Delivering" },
    { title: "Order Delivered", desc: "groceries dropped at your doorstep", key: "Completed" },
  ];

  useEffect(() => {
    // Connect to live updates via Socket.io
    const socket = io("http://localhost:5001");

    // Mock initial order details loading
    setOrder({
      id: orderId || "#1027",
      total: 249,
      eta: "10 mins",
      rider: {
        name: "Rahul Kumar",
        phone: "+91 9876543210",
        vehicle: "Electric Scooter",
      },
    });

    socket.on("connect", () => {
      // Join order specific room
      socket.emit("join_order", { orderId });
    });

    socket.on("order_status_update", (data) => {
      if (data.status) {
        setStatus(data.status);
        updateProgress(data.status);
      }
    });

    // Simulated status updates in case socket is not running
    const timer = setTimeout(() => {
      setStatus("Packing");
      setProgress(40);
    }, 4000);

    const timer2 = setTimeout(() => {
      setStatus("Delivering");
      setProgress(75);
    }, 9000);

    const timer3 = setTimeout(() => {
      setStatus("Completed");
      setProgress(100);
    }, 15000);

    return () => {
      socket.disconnect();
      clearTimeout(timer);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [orderId]);

  const updateProgress = (currStatus) => {
    switch (currStatus) {
      case "Placed":
        setProgress(10);
        break;
      case "Packing":
        setProgress(40);
        break;
      case "Delivering":
        setProgress(75);
        break;
      case "Completed":
        setProgress(100);
        break;
      default:
        setProgress(10);
    }
  };

  const getPercentageForLine = () => {
    if (status === "Placed") return 0;
    if (status === "Packing") return 33;
    if (status === "Delivering") return 66;
    if (status === "Completed") return 100;
    return 0;
  };

  return (
    <Page>
      <Container>
        <BackLink to="/account">
          <FaArrowLeft /> Back to Account
        </BackLink>

        {order && (
          <>
            <TrackingCard>
              <CardHeader>
                <div>
                  <Title>Track Your Order</Title>
                  <OrderId>Order ID: {order.id}</OrderId>
                </div>
                {status !== "Completed" && (
                  <DeliveryTime>
                    <FaClock />
                    <span>ETA: {order.eta}</span>
                  </DeliveryTime>
                )}
              </CardHeader>

              <StepsContainer>
                <StepLineProgress $percentage={getPercentageForLine()} />
                {steps.map((step, idx) => {
                  const stepIndex = idx;
                  const currentActiveIndex = steps.findIndex(s => s.key === status);
                  const isCompleted = stepIndex < currentActiveIndex;
                  const isActive = stepIndex === currentActiveIndex;

                  return (
                    <StepItem key={step.key} $active={isActive} $completed={isCompleted}>
                      <StepDot $active={isActive} $completed={isCompleted}>
                        {isCompleted ? <FaCheck size={10} /> : idx + 1}
                      </StepDot>
                      <StepContent>
                        <StepTitle>{step.title}</StepTitle>
                        <StepDesc>{step.desc}</StepDesc>
                      </StepContent>
                    </StepItem>
                  );
                })}
              </StepsContainer>

              {status === "Delivering" && order.rider && (
                <RiderCard>
                  <RiderInfo>
                    <RiderAvatar>
                      <FaUser />
                    </RiderAvatar>
                    <div>
                      <RiderName>{order.rider.name}</RiderName>
                      <RiderTag>Rider · {order.rider.vehicle}</RiderTag>
                    </div>
                  </RiderInfo>
                  <CallButton href={`tel:${order.rider.phone}`} aria-label="Call Rider">
                    <FaPhone size={14} />
                  </CallButton>
                </RiderCard>
              )}
            </TrackingCard>

            {status !== "Completed" && (
              <MapContainer>
                <StoreMarker>
                  <FaShoppingBag />
                </StoreMarker>
                <AnimatedRoad />
                <ProgressDot $progress={progress}>
                  <FaTruck size={14} />
                </ProgressDot>
                <DestinationMarker>
                  <FaMapMarkerAlt />
                </DestinationMarker>
              </MapContainer>
            )}
          </>
        )}
      </Container>
    </Page>
  );
}
