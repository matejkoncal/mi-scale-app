import { useEffect, useState } from "react";

export function useMiScale() {
	const [weight, setWeight] = useState(0);
	const [debouncedWeight, setDebouncedWeight] = useState(0);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setDebouncedWeight(weight);
		}, 200);
		return () => clearTimeout(timeout);
	}, [weight]);

	return {
		startScan: getStartScan(setWeight),
		weight,
		debouncedWeight
	}
}

function getStartScan(setWeight: (weight: number) => void) {
	return async () => {
		// https://github.com/WebBluetoothCG/registries/blob/master/gatt_assigned_characteristics.txt
		const device = await navigator.bluetooth.requestDevice({ filters: [{ name: 'MIBFS' }], optionalServices: ["0000181b-0000-1000-8000-00805f9b34fb"] });
		await device?.gatt?.connect();

		const service = await device?.gatt?.getPrimaryService('0000181b-0000-1000-8000-00805f9b34fb');
		const characteristic = await service?.getCharacteristic('body_composition_measurement');
		await characteristic?.startNotifications();

		if (characteristic) {
			characteristic.oncharacteristicvaluechanged = e => {
				const char = e.target as BluetoothRemoteGATTCharacteristic;
				const value = char.value;

				if (value) {
					const buffer = new Uint8Array(value.buffer)
					if (buffer[1] === 132) {
						setWeight(0);
					} else {
						const weight = ((buffer[12] << 8) + buffer[11]) / 200
						setWeight(weight);
					}
				}
			}
		}
	}
}

