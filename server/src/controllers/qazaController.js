const QazaLog = require('../models/QazaLog');

// @desc    Get user Qaza counter
// @route   GET /api/qaza
const getQazaCounts = async (req, res) => {
  try {
    let qaza = await QazaLog.findOne({ userId: req.user._id });
    if (!qaza) {
      qaza = await QazaLog.create({ userId: req.user._id });
    }
    res.json({ success: true, data: qaza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Qaza counts (increment or decrement completed)
// @route   PUT /api/qaza
const updateQazaCounts = async (req, res) => {
  try {
    const { counts, historyItem } = req.body;
    let qaza = await QazaLog.findOne({ userId: req.user._id });

    if (!qaza) {
      qaza = new QazaLog({ userId: req.user._id });
    }

    if (counts) {
      qaza.counts = { ...qaza.counts, ...counts };
    }

    if (historyItem) {
      qaza.history.unshift(historyItem);
      if (historyItem.action === 'completed') {
        qaza.totalCompleted += historyItem.count || 1;
      }
    }

    await qaza.save();
    res.json({ success: true, data: qaza });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getQazaCounts,
  updateQazaCounts
};
