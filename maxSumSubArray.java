/**
 * A class that implements solutions for the Maximum Subarray Sum problem.
 * Contains both brute force and optimized Kadane's algorithm implementations.
 */
public class maxSumSubArray {
    /**
     * Finds the maximum sum of a contiguous subarray using Kadane's algorithm.
     * Time Complexity: O(n)
     * Space Complexity: O(1)
     *
     * @param nums the input array
     * @return maximum subarray sum
     */
    public static int maxSubarray(int[] nums) {
        if (nums == null || nums.length == 0) {
            throw new IllegalArgumentException("Array cannot be null or empty");
        }

        int currentSum = nums[0];
        int maxSum = nums[0];
        int start = 0, end = 0, tempStart = 0;

        for (int i = 1; i < nums.length; i++) {
            if (nums[i] > currentSum + nums[i]) {
                currentSum = nums[i];
                tempStart = i;
            } else {
                currentSum = currentSum + nums[i];
            }

            if (currentSum > maxSum) {
                maxSum = currentSum;
                start = tempStart;
                end = i;
            }
        }

        // Print the subarray indices and sum for better understanding
        System.out.println("Maximum subarray found between indices: " + start + " and " + end);
        System.out.println("Maximum sum of subarray is: " + maxSum);
        return maxSum;
    }
    /**
     * Main method to test the maxSubarray implementation with example cases.
     */
    public static void main(String[] args) {
        // Test Case 1: Simple positive numbers
        int[] test1 = {2, 4, 6, 8, 10};
        System.out.println("\nTest Case 1: Simple positive numbers");
        maxSubarray(test1);

        // Test Case 2: Mixed positive and negative numbers
        int[] test2 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println("\nTest Case 2: Mixed positive and negative numbers");
        maxSubarray(test2);

        // Test Case 3: All negative numbers
        int[] test3 = {-1, -2, -3, -4};
        System.out.println("\nTest Case 3: All negative numbers");
        maxSubarray(test3);
    }
}
