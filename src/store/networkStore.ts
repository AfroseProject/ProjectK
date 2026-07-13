import { create } from 'zustand';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

interface NetworkState {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  type: string;
  setNetworkState: (state: NetInfoState) => void;
  initNetworkListener: () => () => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true,
  isInternetReachable: true,
  type: 'unknown',
  setNetworkState: (state) => set({
    isConnected: state.isConnected,
    isInternetReachable: state.isInternetReachable,
    type: state.type,
  }),
  initNetworkListener: () => {
    return NetInfo.addEventListener((state) => {
      set({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });
  },
}));
