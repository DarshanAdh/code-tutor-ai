import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Slider } from './ui/slider';
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react';

interface BarItem {
  value: number;
  active: boolean;
  swapped: boolean;
}

export const AlgorithmDemo: React.FC = () => {
  const [data, setData] = useState<BarItem[]>([]);
  const [i, setI] = useState(0);
  const [j, setJ] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speedMs, setSpeedMs] = useState(600);
  const timerRef = useRef<number | null>(null);

  const initialData = useMemo(() => {
    const base = [18, 26, 9, 32, 14, 7, 21, 4];
    return base.map((v) => ({ value: v, active: false, swapped: false }));
  }, []);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const reset = () => {
    setData(initialData.map((b) => ({ ...b, active: false, swapped: false })));
    setI(0);
    setJ(0);
    setIsRunning(false);
    if (timerRef.current) window.clearTimeout(timerRef.current);
  };

  const step = () => {
    setData((prev) => {
      const arr = prev.map((b) => ({ ...b, active: false, swapped: false }));
      if (arr.length === 0) return arr;
      if (i >= arr.length - 1) return arr; // done

      // compare j and j+1
      const nextArr = arr.slice();
      nextArr[j].active = true;
      nextArr[j + 1].active = true;

      if (nextArr[j].value > nextArr[j + 1].value) {
        const tmp = nextArr[j];
        nextArr[j] = nextArr[j + 1];
        nextArr[j + 1] = tmp;
        nextArr[j].swapped = true;
        nextArr[j + 1].swapped = true;
      }
      return nextArr;
    });

    setJ((prevJ) => {
      const nextJ = prevJ + 1;
      if (data.length && nextJ >= data.length - 1 - i) {
        setI((prevI) => prevI + 1);
        return 0;
      }
      return nextJ;
    });
  };

  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = window.setTimeout(() => {
      step();
    }, speedMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [isRunning, i, j, speedMs]);

  useEffect(() => {
    if (i >= data.length - 1 && isRunning) {
      setIsRunning(false);
    }
  }, [i, data.length, isRunning]);

  const percent = (value: number) => `${(value / 40) * 100}%`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Visual Algorithm Demo</CardTitle>
        <CardDescription>Bubble sort with step, play, and speed control</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-56 flex items-end gap-2 p-4 rounded-lg bg-accent/40">
          {data.map((bar, index) => (
            <div key={index} className="flex-1 flex items-end">
              <div
                className={
                  `w-full rounded-t-md transition-all duration-300 ` +
                  (bar.swapped ? 'bg-semo-red' : bar.active ? 'bg-primary' : 'bg-muted-foreground/40')
                }
                style={{ height: percent(bar.value) }}
                title={`${bar.value}`}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => setIsRunning((v) => !v)}>
              {isRunning ? (
                <><Pause className="w-4 h-4 mr-2" /> Pause</>
              ) : (
                <><Play className="w-4 h-4 mr-2" /> Play</>
              )}
            </Button>
            <Button size="sm" variant="outline" onClick={step} disabled={isRunning}>
              <StepForward className="w-4 h-4 mr-2" /> Step
            </Button>
            <Button size="sm" onClick={reset}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-3 min-w-[220px]">
            <span className="text-xs text-muted-foreground">Speed</span>
            <Slider value={[speedMs]} min={150} max={1200} step={50} onValueChange={(v) => setSpeedMs(v[0])} />
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          i = {i}, j = {j}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmDemo;


