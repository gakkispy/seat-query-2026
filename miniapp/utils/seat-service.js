const config = require("./config");
const { searchSeatsForMiniProgram } = require("./search-core");

function searchSeats(keyword) {
  if (!config.useRemoteApi) {
    return Promise.resolve(searchSeatsForMiniProgram(keyword));
  }

  return requestRemote(keyword).catch((error) => {
    if (!config.allowLocalFallback) {
      return Promise.reject(error);
    }

    return searchSeatsForMiniProgram(keyword);
  });
}

function requestRemote(keyword) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/api/seat`,
      method: "GET",
      data: { name: keyword },
      success(response) {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          const message = response.data && response.data.error ? response.data.error : "查询服务暂时不可用";
          reject(new Error(message));
          return;
        }

        const items = Array.isArray(response.data) ? response.data : [];
        resolve(
          items.map((item, index) => ({
            id: index + 1,
            title: item.display_name || item.name || "未命名",
            subtitle: item.organization || "未分配部门",
            zone: item.zone,
            row: `${item.row}排`,
            seat: `${item.seat}座`,
            location_text: `${item.zone}${item.row}排${item.seat}座`
          }))
        );
      },
      fail() {
        reject(new Error("网络异常，请稍后重试"));
      }
    });
  });
}

module.exports = {
  searchSeats
};
