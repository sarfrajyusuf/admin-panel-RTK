import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})





// export default defineConfig({
//   optimizeDeps: {
//     esbuildOptions: {
//       define: {
//         global: 'globalThis'
//       },
//       plugins: [react(),
//       NodeGlobalsPolyfillPlugin({
//         buffer: true
//       })
//       ]
//     }
//   }
// })


// export default defineConfig({
//   plugins: [
//     react(),
//   ],
//   optimizeDeps: {
//     esbuildOptions: {
//       define: {
//         global: 'globalThis'
//       },
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//           buffer: true,
//         }),
//       ],
//     },
//   },
// });
