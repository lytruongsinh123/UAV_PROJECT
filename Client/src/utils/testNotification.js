// Demo file để test notification system
import notificationService from "../services/notificationService";

// Test các loại thông báo
export const testNotifications = () => {
    console.log("🧪 Testing notification system...");

    // Test basic notifications
    setTimeout(() => {
        notificationService.success(
            "Test Success",
            "This is a success message"
        );
    }, 1000);

    setTimeout(() => {
        notificationService.error("Test Error", "This is an error message");
    }, 2000);

    setTimeout(() => {
        notificationService.warning(
            "Test Warning",
            "This is a warning message"
        );
    }, 3000);

    setTimeout(() => {
        notificationService.info("Test Info", "This is an info message");
    }, 4000);

    // Test UAV status change
    setTimeout(() => {
        notificationService.statusChange("UAV001", "Pending", "Active");
    }, 5000);

    // Test UAV actions
    setTimeout(() => {
        notificationService.uavAction("ACTIVATE", "UAV002", "is now flying");
    }, 6000);

    setTimeout(() => {
        notificationService.uavAction(
            "COMPLETE",
            "UAV001",
            "mission completed successfully"
        );
    }, 7000);

    // Test batch notification
    setTimeout(() => {
        notificationService.batchStatusChange([
            { droneId: "UAV001", oldStatus: "Active", newStatus: "Completed" },
            { droneId: "UAV002", oldStatus: "Pending", newStatus: "Active" },
            {
                droneId: "UAV003",
                oldStatus: "Active",
                newStatus: "Maintenance",
            },
        ]);
    }, 8000);
};

// Test notification từ console
window.testNotifications = testNotifications;
window.notificationService = notificationService;

export default testNotifications;
