/**
 * Suggestive name :-)
 *
 * @returns {boolean}
 */
export const isSmartDevice = !!(window && typeof window.orientation !== 'undefined')

/**
 * Search for device resource.
 * If it's existent and supported by browser.
 *
 * Reminder: Only works to HTTPS connections
 *
 * @param {String} deviceKind
 *
 * @returns {Promise}
 */
export function getDevice(deviceKind = '') {
  return new Promise((resolve, reject) => {
    try {
      if (
        !deviceKind
        || !navigator.mediaDevices
        || !navigator.mediaDevices.enumerateDevices
      ) {
        reject()

        return
      }

      navigator.mediaDevices.enumerateDevices()
        .catch(reject)
        .then((devices) => {
          const foundDevice = devices.filter((device) => device.kind === deviceKind).pop() || null

          if (foundDevice) {
            resolve(foundDevice)
          } else {
            reject()
          }
        })
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Search for device camera.
 * If it's existent and supported by browser.
 *
 * Reminder: Only works to HTTPS connections
 *
 * @returns {Promise}
 */
export function getCamera() {
  return getDevice('videoinput')
}
