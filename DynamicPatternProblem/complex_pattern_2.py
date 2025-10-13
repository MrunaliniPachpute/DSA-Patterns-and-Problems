# Dynamic program Pattern
# For odd value of n, Pattern is symmetric (e.g., 3,5,7,..)
# for n = 3
# *       *
# **     **
# ***@@@***
#    @@@
#    @@@
#    ***
#     *
#
# for n = 5
# *             *
# **           **
# ***         ***
# ****       ****
# *****@@@@@*****
#      @@@@@
#      @@@@@
#      @@@@@
#      @@@@@
#      *****
#       ***
#        *

def pattern(n):
    # Calculate total rows and columns for pattern dimensions
    row_length = (2 * n) - 1
    col_length = (3 * n)
    pyramid_length = (col_length - row_length) // 2

    # Check if n is valid (must be odd and >= 3)
    if n % 2 == 0 or n < 3:
        print("Enter the odd number")
        return
    else:
        # ---------------------------
        # Printing the upper pyramid part
        # ---------------------------
        for row in range(1, n):
            # Calculate spaces between left and right stars
            space_length = col_length - (2 * row)
            # Print left stars, spaces, and right stars
            print("*" * row + " " * space_length + "*" * row)

        # ---------------------------
        # Printing the center fixed line with '@' symbols
        # ---------------------------
        for row in range(1):
            print("*" * n + "@" * n + "*" * n)

        # ---------------------------
        # Printing the middle '@' block section
        # ---------------------------
        for row in range(1, n):
            # Indent with spaces equal to n and print '@' symbols
            print(" " * n + "@" * n)

        # ---------------------------
        # Printing the reverse lower pyramid
        # ---------------------------
        for row in range(pyramid_length):
            # Add spacing to center the stars
            middle_space = row
            print(" " * n + " " * middle_space + "*" * (n - (2 * row)))

# Take user input
number = int(input("Enter the number : "))

# Call the pattern function
pattern(number)
