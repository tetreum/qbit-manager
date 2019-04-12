const api = require("qbittorrent-api");
const config = require("./config");
const qbt = api.connect(config.qbittorrent.url, config.qbittorrent.username, config.qbittorrent.passsword);

// remove completed downloads from list to avoid redownloads/locked files because of seeding
const removeCompletedDownloads = () => {
    qbt.completed((error, items) => {
        items.forEach((item) => {
            if (item.save_path === config.completedDownloadsPath && item.category === '') {
                qbt.delete(items);
            }
        })
        setTimeout(removeCompletedDownloads, 1000 * 60 * 1);
    });
}

const removeFailedDownloads = () => {
    qbt.errored(function (error, items) {
      items.forEach((item) => {
          if (item.state == 'missingFiles') {
              qbt.delete(item);
          }
      })
    });
}

removeCompletedDownloads();
removeFailedDownloads();