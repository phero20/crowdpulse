import { useState, useEffect, useRef } from 'react';

export function useCrowdData(hasActiveStream = false) {
  const [peopleCount, setPeopleCount] = useState(0);
  const [stressLevel, setStressLevel] = useState(0);
  const [avgSpeed, setAvgSpeed] = useState(0);
  const [status, setStatus] = useState("IDLE");
  const [isCritical, setIsCritical] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  // Refs for persistence tracking
  const prevStatusRef = useRef("IDLE");
  const lastLogTimeRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch('http://localhost:8000/stats', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // If no active stream, only accept IDLE status with 0 values
        if (!hasActiveStream) {
          if (data.status === "IDLE" && data.people_count === 0) {
            setPeopleCount(0);
            setStressLevel(0);
            setAvgSpeed(0);
            setStatus("IDLE");
            setIsCritical(false);
            setIsConnected(true);
            setChartData([]);
          }
          return;
        }

        // We have an active stream - update with real data
        setIsConnected(true);

        const newStatus = data.status || "IDLE";
        const newPeopleCount = data.people_count || 0;
        const newStress = data.stress_level || 0;
        const newSpeed = data.avg_speed || 0;
        const newIsCritical = newStatus === "STAMPEDE RISK!" || newStatus === "CRITICAL";

        // Update State
        setPeopleCount(newPeopleCount);
        setStressLevel(newStress);
        setAvgSpeed(newSpeed);
        setStatus(newStatus);
        setIsCritical(newIsCritical);

        // --- PERSISTENCE LOGIC START ---
        // 1. Save Analytics Snapshot (every fetch)
        try {
          await fetch('http://localhost:5000/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              peopleCount: newPeopleCount,
              avgSpeed: newSpeed,
              stressLevel: newStress,
              status: newStatus
            })
          });
        } catch (err) {
          console.error("Failed to save analytics:", err);
        }

        // 2. Save System Logs (on status change or critical)
        const now = Date.now();
        const statusChanged = prevStatusRef.current !== newStatus;
        const throttleTime = 5000; // 5 seconds throttle for critical logs

        if (statusChanged || (newIsCritical && now - lastLogTimeRef.current > throttleTime)) {
          let logType = 'info';
          if (newStatus === 'WARNING') logType = 'warning';
          if (newIsCritical) logType = 'error';
          if (newStatus === 'NORMAL' && prevStatusRef.current !== 'IDLE') logType = 'success';

          // Don't log IDLE transitions usually
          if (newStatus !== "IDLE") {
            try {
              await fetch('http://localhost:5000/api/logs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: logType,
                  message: statusChanged
                    ? `Status changed from ${prevStatusRef.current} to ${newStatus}`
                    : `Persistent Critical State: ${newStatus}`,
                  metadata: { peopleCount: newPeopleCount, stress: newStress }
                })
              });
              lastLogTimeRef.current = now;
            } catch (err) {
              console.error("Failed to save log:", err);
            }
          }
        }
        prevStatusRef.current = newStatus;
        // --- PERSISTENCE LOGIC END ---

        // Update chart data with real values from active stream
        if (data.people_count !== undefined) {
          setChartData(prev => {
            const newData = [...prev, {
              time: new Date().toLocaleTimeString(),
              count: data.people_count || 0
            }];
            if (newData.length > 20) newData.shift();
            return newData;
          });
        }

      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch stats:", error);
        }
        setIsConnected(false);

        if (!hasActiveStream) {
          setPeopleCount(0);
          setStressLevel(0);
          setAvgSpeed(0);
          setStatus("IDLE");
          setIsCritical(false);
          setChartData([]);
        }
      }
    };

    if (!hasActiveStream) {
      setPeopleCount(0);
      setStressLevel(0);
      setAvgSpeed(0);
      setStatus("IDLE");
      setIsCritical(false);
      setChartData([]);
      fetchData();
      return;
    }

    const interval = setInterval(fetchData, 1000);
    fetchData();
    return () => clearInterval(interval);
  }, [hasActiveStream]);

  return { peopleCount, stressLevel, avgSpeed, status, isCritical, chartData, isConnected };
}