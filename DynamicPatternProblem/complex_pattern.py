# Dynamic program Pattern
# For odd value of n, Pattern is symmetric (e.g., 3,5,7,..)
# for n = 3
# Output --->
#     *
#    ***
#    @ @
# ***@ @***
#  *     *
#
# for n = 5
# Output --->
#        *
#       ***
#      *****
#      @   @
#      @   @
#      @   @
# *****@   @*****
#  ***       ***
#   *         *

def pattern(n):
    # Check for invalid input (even numbers or less than 3)
    if n % 2 == 0 or n < 3:
        print("Enter an odd number please!")
        return
    else:
        # Calculate total rows and columns based on n
        row_length = (2 * n) - 1
        col_length = 3 * n

        # Loop through each row
        for row in range(1, row_length + 1):
            # Define lengths for parts of the pattern
            upper_part_length = ((col_length - row_length) // 2)
            middle_part_length = row_length - upper_part_length

            # Upper triangular star pattern
            if row <= upper_part_length:
                left_space = " " * n
                middle_space = " " * (((col_length - row_length) // 2) - row)
                upper_star = "*" * ((2 * row) - 1)
                print(left_space + middle_space + upper_star)

            # Middle section with '@' symbols
            elif row <= middle_part_length:
                left_space = " " * n
                middle_space = " " * (middle_part_length - upper_part_length)
                print(left_space + "@" + middle_space + "@")

            # Central row with '@' enclosed by stars
            elif row <= (middle_part_length + 1):
                middle_space = " " * (middle_part_length - upper_part_length)
                print("*" * n + "@" + middle_space + "@" + "*" * n)

            # Lower inverted part of the pattern
            else:
                left_space = " " * ((row - n) // 2)
                star = "*" * (n - (2 * ((row - n) // 2)))
                middle_space = " " * n
                print(left_space + star + left_space + middle_space + left_space + star)

# Take user input
number = int(input("Enter the number : "))

# Call the pattern function
pattern(number)
