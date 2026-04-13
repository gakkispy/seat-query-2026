const { searchSeats } = require("../../utils/seat-service");

Page({
  data: {
    keyword: "",
    loading: false,
    error: "",
    hasSearched: false,
    results: []
  },

  onInput(event) {
    this.setData({
      keyword: event.detail.value
    });
  },

  onClear() {
    this.setData({
      keyword: "",
      loading: false,
      error: "",
      hasSearched: false,
      results: []
    });
  },

  onSearch() {
    const keyword = (this.data.keyword || "").trim();
    if (!keyword) {
      this.setData({
        error: "请输入姓名后再查询。",
        hasSearched: false,
        results: []
      });
      return;
    }

    this.setData({
      loading: true,
      error: ""
    });

    searchSeats(keyword)
      .then((results) => {
        this.setData({
          results,
          hasSearched: true
        });
      })
      .catch((error) => {
        this.setData({
          results: [],
          hasSearched: true,
          error: error && error.message ? error.message : "查询失败，请稍后重试。"
        });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  }
});
