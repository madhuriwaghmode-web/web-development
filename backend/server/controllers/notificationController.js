import Notification from '../models/Notification.js'

export async function getNotifications(req, res, next) {
  try {
    const userRole = req.user?.role || 'health_worker'
    const userId = req.user?._id

    const filter = {
      $or: [
        { targetRole: 'all' },
        { targetRole: userRole },
        ...(userId ? [{ recipient: userId }] : []),
      ],
    }

    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(30)
    const unreadCount = await Notification.countDocuments({ ...filter, isRead: false })

    res.json({
      success: true,
      unreadCount,
      data: notifications,
    })
  } catch (err) {
    next(err)
  }
}

export async function markAsRead(req, res, next) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    )
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' })
    }
    res.json({ success: true, data: notification })
  } catch (err) {
    next(err)
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    const userRole = req.user?.role || 'health_worker'
    const userId = req.user?._id

    await Notification.updateMany(
      {
        $or: [
          { targetRole: 'all' },
          { targetRole: userRole },
          ...(userId ? [{ recipient: userId }] : []),
        ],
      },
      { isRead: true }
    )

    res.json({ success: true, message: 'All notifications marked as read' })
  } catch (err) {
    next(err)
  }
}
